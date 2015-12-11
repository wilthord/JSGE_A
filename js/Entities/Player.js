PlayerClass = function(playerJson){		//Heredamos de la clase entidad
	EntityClass.call(this);
	
	this.pos.x=playerJson.xIni;
	this.pos.y=playerJson.yIni;
	this.currSpriteName = 'Monstruo';
	this.sPNameNormal = 'Monstruo';
	this.sPNameOculto = 'MonstruoOculto';
	this.isOculto = false;
	this.isMoviendo = false;
	this.isAtacando = false;		//Utilizado para mostrar animacion de ataque
	this.movimiento = 2;				//Cantidad de movimiento por cada tick
	//Indica el tiempo que debe esperar, para disparar nuevamente
	this.weponColdown = 30;
	//Indica si el arma está lista para disparar, 0: listo, >0 enfriando
	this.weponReadyCountdown = 0;
	//TRUE indica que cada click es un disparo, FALSE que mientras este presionado el mouse, dispara si se ha cumplido el cold down del arma
	this.discreteShoot = true;
	//Vida del jugador
	this.energy = 1;
	if(playerJson.damage){
		this.damage = playerJson.damage;
	}else{
		this.damage = 5;
	}

	this.w=2;
	this.h=2;

	// Create our physics body;
    var entityDef = {
        id: "Player",
        type: 'dynamic',
        x: this.pos.x,
        y: this.pos.y,
        halfHeight: (64/this.w) * 0.5,
        halfWidth: (64/this.h) * 0.5,
        damping: 0,
        angle: 0,
        filterGroupIndex:1,
        categories: ['player'],
        collidesWith: ['player'],
        userData: {
            "id": "Player",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);
}

PlayerClass.prototype = Object.create(EntityClass.prototype);
PlayerClass.prototype.constructor = PlayerClass;

PlayerClass.prototype.update = function(){

	if(this.energy<1){
		isDead=true;
		return;
	}

	if(this.weponReadyCountdown>0){
		this.weponReadyCountdown--;
	}

	this.isMoviendo=false;

	//Validamos si hay acciones pendientes por ejecutar
	if(gInputEngine.actions[MOV_IZQUIERDA]){
		this.pos.x = this.pos.x - this.movimiento;
		this.isMoviendo=true;
	}
	if(gInputEngine.actions[MOV_DERECHA]){
		this.pos.x = this.pos.x + this.movimiento;
		this.isMoviendo=true;
	}
	if(gInputEngine.actions[MOV_ARRIBA]){
		this.pos.y = this.pos.y - this.movimiento;
		this.isMoviendo=true;
	}
	if(gInputEngine.actions[MOV_ABAJO]){
		this.pos.y = this.pos.y + this.movimiento;
		this.isMoviendo=true;
	}

	this.physBody.SetPosition(this.pos);
	this.pos=this.physBody.GetPosition();

	//Si se mueve el jugador, deja de estar oculto
	if(this.isMoviendo) this.isOculto=false;

	//Solo te puedes ocultar si no te mueves
	if(gInputEngine.actions[OCULTAR] && this.isMoviendo==false){
		gInputEngine.actions[OCULTAR] = false;
		//Si está oculto, se hace visible
		this.isOculto=this.isOculto?false:true;
	}

	if(this.isOculto==true){
		this.currSpriteName= this.sPNameOculto;
	}else{
		this.currSpriteName= this.sPNameNormal;
	}

	this.physBody.SetPosition(this.pos);

	//Validamos si esta activa la accion de disparar
	//if(gInputEngine.actions[ACT_DISPARA] && this.weponReadyCountdown==0){
		/*
		if(this.discreteShoot){
			this.weponReadyCountdown=this.weponColdown;
		}
		var disparo = new BulletClass(this.pos, GE.marcaMouse.pos);
		disparo.calcularSteps();
		GE.entities.push(disparo);
		*/
	//}

}