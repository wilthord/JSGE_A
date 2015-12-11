CristalClass = function(cristalJson){
	EntityClass.call(this);

	this.pos = {x:cristalJson.xIni, y:cristalJson.yIni};

	this.isShield = true;

	this.currSpriteName = "Cristal";
	this.spNameEscudo = "Escudo";
	this.spNameAltar = "Altar";

	this.w = 2;
	this.h = 2;

	var entityDef = {
        id: "Cristal",
        type: 'static',
        x: this.pos.x ,
        y: this.pos.y,
        halfHeight: 64 / 2,
        halfWidth: 64 / 2,
        damping: 0,
        angle: this.angulo,
        filterGroupIndex:1,
        isSensor:true,
        categories: ['projectile'],
        collidesWith: ['player'],
        userData: {
            "id": "Cristal",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);

}

CristalClass.prototype = Object.create(EntityClass.prototype);

CristalClass.prototype.constructor = CristalClass;

CristalClass.prototype.update = function(){

	if(GE.pilaresActivos<1){
		this.isShield=false;
	}

}

CristalClass.prototype.draw = function(){
	pintarSpriteCustom(this.spNameAltar, this.pos.x, this.pos.y, 1, 1, this.angulo);
	EntityClass.prototype.draw.call(this);
	if(this.isShield==true){
		pintarSpriteCustom(this.spNameEscudo, this.pos.x, this.pos.y, 1, 1, this.angulo);
	}
}

CristalClass.prototype.onTouch = function(otherBody, point, impulse){

    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;
    

    if(physOwner !== null && physOwner instanceof PlayerClass) {
    		if(this.isShield==true){
    			physOwner.isDead = true;
    		}else{
    			GE.cristalesActivos--;
    			this.isDead = true;
    		}
    }

    return true;
}


CristalClass.prototype.endTouch = function(otherBody, point, impulse){
    
    return true;
}