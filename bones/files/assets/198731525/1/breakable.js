var Breakable = pc.createScript('breakable');

// initialize code called once per entity
Breakable.prototype.initialize = function () {
    this.isBssroken = false; // Asegura que el objeto solo se rompa una vez
};

// Método que se llama cuando el objeto es golpeado
Breakable.prototype.break = function () {
    if (this.isBroken) return; // Evitar que se rompa múltiples veces

    this.isBroken = true;

    // Lógica para romper el objeto (desactivarlo, cambiar de modelo, etc.)
    console.log(this.entity.name + ' se ha roto');

    // Ejemplo: desactivar el objeto
    this.entity.enabled = false;

    // También puedes reproducir animaciones, emitir partículas, cambiar el material, etc.
};
