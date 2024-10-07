var OrbitCameraTouchJoypadInput = pc.createScript('orbitCameraTouchJoypadInput');
OrbitCameraTouchJoypadInput.attributes.add('joystickId', { type: 'string' });

OrbitCameraTouchJoypadInput.attributes.add('orbitSensitivity', {
    type: 'number',
    default: 0.3,
    title: 'Orbit Sensitivity',
    description: 'How fast the camera moves around the orbit. Higher is faster'
});

// initialize code called once per entity
OrbitCameraTouchJoypadInput.prototype.initialize = function () {
    this.orbitCamera = this.entity.script.orbitCamera;
    this.isMobile = this.detectMobile();
};

OrbitCameraTouchJoypadInput.prototype.update = function (dt) {
    if (this.isMobile) {
        const joystick = window.touchJoypad.sticks[this.joystickId];

        this.orbitCamera.pitch += joystick.y * this.orbitSensitivity * dt;
        this.orbitCamera.yaw -= joystick.x * this.orbitSensitivity * dt;
    }
};
// Función para detectar si el dispositivo es móvil
OrbitCameraTouchJoypadInput.prototype.detectMobile = function () {
    // Detecta usando el User Agent del navegador
    var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);

    // Alternativamente, puedes usar las dimensiones de la pantalla
    if (!isMobile) {
        isMobile = (window.innerWidth <= 800 && window.innerHeight <= 600); // Considera un dispositivo móvil si la pantalla es pequeña
    }

    return isMobile;
};
