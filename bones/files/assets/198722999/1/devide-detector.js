var DevideDetector = pc.createScript('devideDetector');

// initialize code called once per entity
DevideDetector.prototype.initialize = function () {
    // Detecta si el dispositivo es móvil o de escritorio
    this.isMobile = this.detectMobile();

    if (!this.isMobile) {
        console.log("Dispositivo: Escritorio");
        //Quitar los elementos de joystick y poner la información de teclas
        let movilElementNames = ["Left Half Touch Joystick", "Right Fixed Touch Joystick", "Special Touch Button", "Attack Touch Button"];
        for (let i = 0; i < movilElementNames.length; i++) {
            this.app.root.findByName(movilElementNames[i]).enabled = false;
        }
        let desktopElementNames = ["w", "a", "s", "d", "j", "k"];
        for (let j = 0; j < desktopElementNames.length; j++) {
            this.app.root.findByName(desktopElementNames[j]).enabled = true;
        }
    } else {
        console.log("Dispositivo: Móvil");

    }
};

// Función para detectar si el dispositivo es móvil
DevideDetector.prototype.detectMobile = function () {
    // Detecta usando el User Agent del navegador
    var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);

    // Alternativamente, puedes usar las dimensiones de la pantalla
    if (!isMobile) {
        isMobile = (window.innerWidth <= 800 && window.innerHeight <= 600); // Considera un dispositivo móvil si la pantalla es pequeña
    }

    return isMobile;
};

// update code called every frame
DevideDetector.prototype.update = function (dt) {
    // Lógica opcional si necesitas comprobar el dispositivo cada frame
};
