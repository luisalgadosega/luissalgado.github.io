var PlayerController = pc.createScript('playerController');

/** Attributes */
PlayerController.attributes.add('cameraEntity', { type: 'entity' });
PlayerController.attributes.add('animEntity', { type: 'entity' });
PlayerController.attributes.add('power', { type: 'number', default: 450000 });
PlayerController.attributes.add('joystickId', { type: 'string' });
PlayerController.attributes.add('attackButtonId', { type: 'string' });
PlayerController.attributes.add('specialButtonId', { type: 'string' });
PlayerController.attributes.add('sword', { type: 'entity' });  // Referencia a la espada como Trigger

PlayerController.prototype.initialize = function () {
    this._anim = this.animEntity.anim;
    this._angle = 0;

    // Vectores de movimiento
    this._frameMovementRight = new pc.Vec3();
    this._frameMovementForward = new pc.Vec3();
    this._frameMovementTotal = new pc.Vec3();

    // Obtener referencia a los botones
    this.desktopButtons = {
        "w": this.app.root.findByName("w"),
        "a": this.app.root.findByName("a"),
        "s": this.app.root.findByName("s"),
        "d": this.app.root.findByName("d"),
        "j": this.app.root.findByName("j"),
        "k": this.app.root.findByName("k")
    };

    // Escuchar eventos del teclado
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);

    // Estado de las teclas
    this.keysPressed = {
        forward: false,
        backward: false,
        left: false,
        right: false
    };

    // Configurar la espada para detectar triggers
    if (this.sword) {
        this.sword.collision.on('triggerenter', this.onSwordTriggerEnter, this);  // Usar triggers en lugar de colisiones físicas
    } else {
        console.error('Espada no encontrada');
    }
};

// Función que se llama cuando la espada detecta una colisión con otro objeto (Trigger)
PlayerController.prototype.onSwordTriggerEnter = function (otherEntity) {
    // Verificar si el objeto que golpeamos tiene un script 'breakable'
    if (otherEntity.script && otherEntity.script.breakable) {
        otherEntity.script.breakable.break();  // Romper el objeto
    }
};

// Función para cambiar el color de un botón al iluminarlo
PlayerController.prototype.illuminateButton = function (buttonName, isPressed) {
    var button = this.desktopButtons[buttonName];
    if (button && button.element) {
        if (isPressed) {
            button.element.color = new pc.Color(1, 1, 0); // Amarillo al presionar
        } else {
            button.element.color = new pc.Color(1, 1, 1); // Blanco al soltar
        }
    }
};

/**
 * Update - llamado en cada frame
 */
PlayerController.prototype.update = function (dt) {
    // Reseteamos el movimiento
    this._frameMovementTotal.set(0, 0, 0);

    const joypad = window.touchJoypad;
    const joystick = joypad.sticks[this.joystickId];

    // --------- Movimiento con joystick ---------
    if (joystick) {
        this._frameMovementRight.copy(this.cameraEntity.right);
        this._frameMovementRight.y = 0; // Eliminar componente vertical
        this._frameMovementRight.normalize();
        this._frameMovementRight.scale(joystick.x);

        this._frameMovementForward.copy(this.cameraEntity.forward);
        this._frameMovementForward.y = 0; // Eliminar componente vertical
        this._frameMovementForward.normalize();
        this._frameMovementForward.scale(joystick.y);

        this._frameMovementTotal.add2(this._frameMovementRight, this._frameMovementForward);
    }

    // --------- Movimiento con teclado (WASD) ---------
    var moveX = 0;
    var moveY = 0;

    if (this.keysPressed.forward) {
        moveY = 1;
    }
    if (this.keysPressed.backward) {
        moveY = -1;
    }
    if (this.keysPressed.left) {
        moveX = -1;
    }
    if (this.keysPressed.right) {
        moveX = 1;
    }

    if (moveX !== 0 || moveY !== 0) {
        this._frameMovementRight.copy(this.cameraEntity.right);
        this._frameMovementRight.y = 0; // Eliminar componente vertical
        this._frameMovementRight.normalize();
        this._frameMovementRight.scale(moveX);

        this._frameMovementForward.copy(this.cameraEntity.forward);
        this._frameMovementForward.y = 0; // Eliminar componente vertical
        this._frameMovementForward.normalize();
        this._frameMovementForward.scale(moveY);

        this._frameMovementTotal.add2(this._frameMovementRight, this._frameMovementForward);
    }

    // --------- Aplicar impulso al rigidbody ---------
    if (this._frameMovementTotal.lengthSq() > 0) {
        // Normaliza el vector total de movimiento
        this._frameMovementTotal.normalize();
        this._frameMovementTotal.scale(1.5);

        // Aplicar impulso en lugar de fuerza
        this.entity.rigidbody.applyImpulse(this._frameMovementTotal);

        // Calcular el ángulo y rotar el personaje
        const newAngle = 90 - (Math.atan2(this._frameMovementTotal.z, this._frameMovementTotal.x) * pc.math.RAD_TO_DEG);
        this._angle = pc.math.lerpAngle(this._angle, newAngle, 0.4) % 360;
        this.animEntity.setEulerAngles(0, this._angle, 0);

        // Actualizar la velocidad de la animación
        this._anim.setFloat('speed', this.entity.rigidbody.linearVelocity.length());
    } else {
        // Detener la animación si no hay movimiento
        this._anim.setFloat('speed', 0);
    }

    // --------- Detección de ataques ---------
    if (joypad.buttons.wasPressed(this.attackButtonId)) {
        this._anim.baseLayer.transition('Attack Basic');
    } else if (joypad.buttons.wasPressed(this.specialButtonId)) {
        this._anim.baseLayer.transition('Attack Special');
    }
};

/**
 * Detecta cuando se presiona una tecla
 */
PlayerController.prototype.onKeyDown = function (e) {
    switch (e.key) {
        case pc.KEY_W:
            this.keysPressed.forward = true;
            this.illuminateButton("w", true);
            break;
        case pc.KEY_S:
            this.keysPressed.backward = true;
            this.illuminateButton("s", true);
            break;
        case pc.KEY_A:
            this.keysPressed.left = true;
            this.illuminateButton("a", true);
            break;
        case pc.KEY_D:
            this.keysPressed.right = true;
            this.illuminateButton("d", true);
            break;
        case pc.KEY_J:  // Tecla J para ataque básico
            this._anim.baseLayer.transition('Attack Basic');
            this.illuminateButton("j", true);
            break;
        case pc.KEY_K:  // Tecla K para ataque especial
            this._anim.baseLayer.transition('Attack Special');
            this.illuminateButton("k", true);
            break;
    }
};

/**
 * Detecta cuando se suelta una tecla
 */
PlayerController.prototype.onKeyUp = function (e) {
    switch (e.key) {
        case pc.KEY_W:
            this.keysPressed.forward = false;
            this.illuminateButton("w", false);
            break;
        case pc.KEY_S:
            this.keysPressed.backward = false;
            this.illuminateButton("s", false);
            break;
        case pc.KEY_A:
            this.keysPressed.left = false;
            this.illuminateButton("a", false);
            break;
        case pc.KEY_D:
            this.keysPressed.right = false;
            this.illuminateButton("d", false);
            break;
        case pc.KEY_J:  // Tecla J para ataque básico
            this.illuminateButton("j", false);
            break;
        case pc.KEY_K:  // Tecla K para ataque especial
            this.illuminateButton("k", false);
            break;
    }
};
