PisoClass = function(pisoJson){
	EntityClass.call(this);

    this.size = {x:pisoJson.width,y:pisoJson.height};

    this.pos = {x:pisoJson.x+this.size.x/2, y:pisoJson.y+this.size.y/2};    

	//this.currSpriteName = "Pilar";

	this.contactos = [];

	var entityDef = {
        id: "piso",
        type: 'static',
        x: this.pos.x ,
        y: this.pos.y,
        halfHeight: this.size.y / 2,
        halfWidth: this.size.x / 2,
        damping: 0,
        angle: this.angulo,
        filterGroupIndex:1,
        categories: ['projectile'],
        collidesWith: ['player'],
        userData: {
            "id": "piso",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);

}

PisoClass.prototype = Object.create(EntityClass.prototype);

PisoClass.prototype.constructor = PisoClass;

PisoClass.prototype.update = function(){
    this.pos = this.physBody.GetPosition();

}


PisoClass.prototype.draw = function(){
    GE.ctx.beginPath();
    GE.ctx.moveTo(this.pos.x - GE.camara.offset.x - this.size.x/2, this.pos.y - GE.camara.offset.y - this.size.y/2);
    GE.ctx.lineTo(this.pos.x - GE.camara.offset.x + this.size.x/2, this.pos.y - GE.camara.offset.y - this.size.y/2);
    GE.ctx.lineTo(this.pos.x - GE.camara.offset.x + this.size.x/2, this.pos.y - GE.camara.offset.y + this.size.y/2);
    GE.ctx.lineTo(this.pos.x - GE.camara.offset.x - this.size.x/2, this.pos.y - GE.camara.offset.y + this.size.y/2);
    GE.ctx.lineTo(this.pos.x - GE.camara.offset.x - this.size.x/2, this.pos.y - GE.camara.offset.y - this.size.y/2);
    GE.ctx.strokeStyle = '#ff0000';
    GE.ctx.stroke();
    //NO PINTAMOS NADA
}