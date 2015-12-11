BulletClass = function(iniPos, endPos) {
	EntityClass.call(this);
	
	var vecIni = new b2Vec2(iniPos.x, iniPos.y);
	//var vecDest = new b2Vec2(endPos.x, endPos.y);

	this.dir = new b2Vec2(endPos.x, endPos.y);
	this.dir.Subtract(vecIni);
	this.dir.Normalize();
	this.inicio={x:iniPos.x, y:iniPos.y};
	this.destino={x:endPos.x, y:endPos.y};
	this.step=1;
	this.totalSteps=1;
	this.velBullet=150;
	this.currSpriteName= 'Cuadro3';

	this.pos.x = iniPos.x;
	this.pos.y = iniPos.y;

	this.last.x = iniPos.x;
	this.last.y = iniPos.y;

	this.isDead=false;

	// Create our physics body;
    var entityDef = {
        id: "Bullet",
        type: 'dynamic',
        x: iniPos.x,
        y: iniPos.y,
        halfHeight: 23 * 0.5,
        halfWidth: 23 * 0.5,
        damping: 0,
        angle: 0,
        filterGroupIndex:-2,
        categories: ['projectile'],
        collidesWith: ['player'],
        userData: {
            "id": "Bullet",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);
    this.physBody.SetLinearVelocity(new b2Vec2(this.dir.x * this.velBullet, this.dir.y * this.velBullet));

}

BulletClass.prototype = Object.create(EntityClass.prototype);

BulletClass.prototype.constructor = BulletClass;

BulletClass.prototype.update = function(){

    if(this.physBody !== null) {
        this.pos = this.physBody.GetPosition();
        this.physBody.SetLinearVelocity(new b2Vec2(this.dir.x * this.velBullet, this.dir.y * this.velBullet));
    }

	//Se asume que si uno de los ejes (x o y) del destino es superado, se alcanzó el objetivo
    //Primero Se valida si se alcanzó o se pasó el punto destino, en el eje de las x
    if(!this.isDead) {
		if(this.pos.x>this.last.x){
			if(this.destino.x<=this.pos.x && this.destino.x>=this.last.x){
				this.isDead=true;
				this.pos = this.destino;
			}
		}else{
			if(this.destino.x>=this.pos.x && this.destino.x<=this.last.x){
				this.isDead=true;
				this.pos = this.destino;
			}
		}
	}
	//Si no se detuvo por las validaciones en el eje de las x, validamos en y
	if(!this.isDead) {
		if(this.pos.y>this.last.y){
			if(this.destino.y<=this.pos.y && this.destino.y>=this.last.y){
				this.isDead=true;
				this.pos = this.destino;
			}
		}else{
			if(this.destino.y>=this.pos.y && this.destino.y<=this.last.y){
				this.isDead=true;
				this.pos = this.destino;
			}
		}
	}

	this.last.x=this.pos.x;
    this.last.y=this.pos.y;

	if(!this.isDead) {
		this.physBody.SetLinearVelocity(new b2Vec2(this.dir.x * this.velBullet, this.dir.y * this.velBullet));
	}else{
		this.physBody.SetLinearVelocity(new b2Vec2(0,0));
		GE.entities.push(new SplashClass(this.pos));
	}
	
}

/*
	draw : function() { 
        pintarSprite(this.currSpriteName, this.pos.x, this.pos.y);
    },
*/

BulletClass.prototype.calcularSteps = function(){
	var distanciaCuadrado = Math.pow( Math.abs(this.destino.x-this.inicio.x), 2) + Math.pow( Math.abs(this.destino.y-this.inicio.y), 2)
	this.totalSteps = distanciaCuadrado / Math.pow(this.velBullet, 2);
}