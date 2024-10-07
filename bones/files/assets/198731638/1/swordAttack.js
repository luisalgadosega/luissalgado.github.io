var SwordAttack = pc.createScript('swordAttack');

// initialize code called once per entity
SwordAttack.prototype.initialize = function () {
    // Asegúrate de que la espada tiene un componente de colisión y que es un trigger
    if (!this.entity.collision) {
        console.error('La espada necesita un componente de colisión');
        return;
    }

    // Suscribirnos al evento de trigger cuando la espada golpea algo
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

// Este método se ejecuta cuando la espada entra en contacto con otro objeto que tiene un colisionador de tipo 'trigger'
SwordAttack.prototype.onTriggerEnter = function (otherEntity) {
    // Verificar si el otro objeto tiene el script 'breakable'
    if (otherEntity.script && otherEntity.script.breakable) {
        // Llamar a la función de rotura
        otherEntity.script.breakable.break();
    }
};
