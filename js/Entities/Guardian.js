GuardianClass = function(guardianJson){
	EntityClass.call(this);

	//Acá se guarda la relación de las entidades con collision
	this.contactos = [];

	this.origen = {x:guardianJson.xIni,y:guardianJson.yIni};
	this.destino = {x:guardianJson.xDest,y:guardianJson.yDest};
	this.pos = {x:guardianJson.xIni,y:guardianJson.yIni};
	this.last = {x:guardianJson.xIni,y:guardianJson.yIni};
	if(guardianJson.velocidad){
		this.speed = guardianJson.velocidad;
	}else{
		this.speed = 50;
	}
	this.energy = 10;
	this.damage = 3;
	this.currSpriteName = "Vision";
	//this.rangoVisionSpriteName = "Vision";

	this.dir = new b2Vec2(this.destino.x, this.destino.y);
	this.dir.Subtract(this.origen);
	this.dir.Normalize();

	this.w=2;
	this.h=2;

	this.visorW = 192 / this.w;
	this.visorH = 64 / this.w;

	this.angulo = Math.atan2(this.dir.y, this.dir.x);

	// Create our physics body;
    var entityDef = {
        id: "Guardian",
        type: 'dynamic',
        x: this.origen.x ,
        y: this.origen.y,
        halfHeight: this.visorH / 2,
        halfWidth: this.visorW / 2,
        damping: 0,
        angle: this.angulo,
        isSensor:true,
        filterGroupIndex:-1,
        categories: ['projectile'],
        collidesWith: ['player'],
        userData: {
            "id": "Guardian",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);
    this.physBody.SetLinearVelocity(new b2Vec2(this.dir.x * this.speed, this.dir.y * this.speed));
}

GuardianClass.prototype = Object.create(EntityClass.prototype);
GuardianClass.prototype.constructor = GuardianClass;

GuardianClass.prototype.update = function(){

	//Validamos los contactos
	if(this.contactos!=null){
		for(var i = 0; i<this.contactos.length; i++){
			if(this.contactos[i] !== null && this.contactos[i] instanceof PlayerClass) {
		    	if(this.contactos[i].isOculto!=true){
		    		this.contactos[i].isDead = true;
		    	}
		    }
		}
	}


	this.angulo = Math.atan2(this.dir.y, this.dir.x);
	if(this.physBody !== null) {
        this.pos = this.physBody.GetPosition();
        //this.physBody.SetPosition({x:this.pos.x/4, y:this.pos.y});
        this.physBody.SetAngle(this.angulo);
        this.physBody.SetLinearVelocity(new b2Vec2(this.dir.x * this.speed, this.dir.y * this.speed));
    }

    
    //this.physBody.SetAngle( this.angulo);

	//Se asume que si uno de los ejes (x o y) del destino es superado, se alcanzó el objetivo
    //Primero Se valida si se alcanzó o se pasó el punto destino, en el eje de las x
    if(!this.isDead) {
		if(this.pos.x>this.last.x){
			if(this.destino.x+(2*this.visorW/3)<=this.pos.x && this.destino.x+(2*this.visorW/3)>=this.last.x){
				this.pos = {x:this.destino.x,y:this.destino.y} ;
				var temp = {x:this.origen.x, y:this.origen.y};
				this.origen={x:this.destino.x, y:this.destino.y};
				this.destino={x:temp.x, y:temp.y};
			}
		}else if(this.pos.x<this.last.x){
			if( (this.destino.x-(2*this.visorW/3)>=this.pos.x && this.destino.x-(2*this.visorW/3)<=this.last.x) && !(this.origen.x===this.destino.x)){
				this.pos = {x:this.destino.x,y:this.destino.y} ;
				var temp = {x:this.origen.x, y:this.origen.y};
				this.origen={x:this.destino.x, y:this.destino.y};
				this.destino={x:temp.x, y:temp.y};
			}
		}
	}
	//Si no se detuvo por las validaciones en el eje de las x, validamos en y
	if(!this.isDead) {
		if(this.pos.y>this.last.y){
			if(this.destino.y+(2*this.visorW/3)<=this.pos.y && this.destino.y+(2*this.visorW/3)>=this.last.y){
				this.pos = {x:this.destino.x,y:this.destino.y} ;
				var temp = {x:this.origen.x, y:this.origen.y};
				this.origen={x:this.destino.x, y:this.destino.y};
				this.destino={x:temp.x, y:temp.y};
			}
		}else if(this.pos.y<this.last.y){
			if((this.destino.y-(2*this.visorW/3)>=this.pos.y && this.destino.y-(2*this.visorW/3)<=this.last.y) && !(this.origen.y===this.destino.y)){
				this.pos = {x:this.destino.x,y:this.destino.y} ;
				var temp = {x:this.origen.x, y:this.origen.y};
				this.origen={x:this.destino.x, y:this.destino.y};
				this.destino={x:temp.x, y:temp.y};
			}
		}
	}

	this.dir = new b2Vec2(this.destino.x, this.destino.y);
	this.dir.Subtract(this.origen);
	this.dir.Normalize();

	this.angulo = Math.atan2(this.dir.y, this.dir.x);

	this.physBody.SetPositionAndAngle(this.pos, this.angulo);

	this.last.x=this.pos.x;
    this.last.y=this.pos.y;

	if(!this.isDead) {
		this.physBody.SetLinearVelocity(new b2Vec2(this.dir.x * this.speed, this.dir.y * this.speed));
	}
	

}
/*
GuardianClass.prototype.draw = function(){
	//EntityClass.prototype.draw.call(this);
	pintarSpriteCenter(this.currSpriteName, this.pos.x, this.pos.y, this.w, this.h, this.angulo, 'Y');
	pintarSpriteCustom(this.rangoVisionSpriteName, this.pos.x, this.pos.y, this.w, this.h, this.angulo);
}*/

GuardianClass.prototype.onTouch = function(otherBody, point, impulse){

    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;
    

    if(physOwner !== null && physOwner instanceof PlayerClass) {
    	if(physOwner.isOculto!=true){
    		physOwner.isDead = true;
    	}else{
    		this.contactos.push(physOwner);
    	}
    }

    return true;
}


GuardianClass.prototype.endTouch = function(otherBody, point, impulse){
    
    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;

    if(physOwner !== null && physOwner instanceof PlayerClass) {
    	this.contactos.removeObj(physOwner);
    }

    return true;
}