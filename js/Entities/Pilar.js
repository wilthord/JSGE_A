PilarClass = function(pilarJson){
	EntityClass.call(this);

	this.pos = {x:pilarJson.xIni, y:pilarJson.yIni};

	this.energia = 300;

	this.currSpriteName = "Pilar";

	this.contactos = [];

	var entityDef = {
        id: "Pilar",
        type: 'static',
        x: this.pos.x ,
        y: this.pos.y,
        halfHeight: 64 / 2,
        halfWidth: 64 / 2,
        damping: 0,
        angle: this.angulo,
        filterGroupIndex:1,
        categories: ['projectile'],
        collidesWith: ['player'],
        userData: {
            "id": "Pilar",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);

}

PilarClass.prototype = Object.create(EntityClass.prototype);

PilarClass.prototype.constructor = PilarClass;

PilarClass.prototype.update = function(){
	//Validamos los contactos
	if(this.contactos!=null){
		for(var i = 0; i<this.contactos.length; i++){
			if(this.contactos[i] !== null && this.contactos[i] instanceof PlayerClass) {
		    	if(this.contactos[i].isOculto!=true){
		    		this.contactos[i].isAtacando = true;
		    		this.energia -= this.contactos[i].damage;
		    	}else{
		    		this.contactos[i].isAtacando = false;
		    	}
		    }
		}
	}

	if(this.energia<=0 && this.isDead==false){
		this.isDead = true;
		GE.pilaresActivos --;
	}
}

PilarClass.prototype.onTouch = function(otherBody, point, impulse){

    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;
    

    if(physOwner !== null && physOwner instanceof PlayerClass) {
    		this.contactos.push(physOwner);
    }

    return true;
}


PilarClass.prototype.endTouch = function(otherBody, point, impulse){
    
    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;

    if(physOwner !== null && physOwner instanceof PlayerClass) {
    	physOwner.isAtacando=false;
    	this.contactos.removeObj(physOwner);

    }

    return true;
}