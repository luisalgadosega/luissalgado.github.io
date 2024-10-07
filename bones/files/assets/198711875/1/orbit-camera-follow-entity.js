var OrbitCameraFollowEntity = pc.createScript('orbitCameraFollowEntity');
OrbitCameraFollowEntity.attributes.add('followEntity', { type: 'entity' });

// initialize code called once per entity
OrbitCameraFollowEntity.prototype.initialize = function() {
    this.orbitCamera = this.entity.script.orbitCamera;
};

// update code called every frame
OrbitCameraFollowEntity.prototype.postUpdate = function(dt) {
    this.orbitCamera.pivotPoint = this.followEntity.getPosition();
};

// swap method called for script hot-reloading
// inherit your script state here
// OrbitCameraFollowEntity.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/