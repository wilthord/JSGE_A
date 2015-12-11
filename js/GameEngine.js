/** Codigo para presentar estadisticas de rendimiento en tiempo real **/
var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

pisoSpriteName = "Piso";

document.getElementById("divStats").appendChild(stats.domElement);
/** Fin del codigo de estadisticas **/

GameEngineClass = function(){

	this.ctx = {};

	this.canvasObj = {};

	this.canvasSize = {w:500, h:500};

	this.entities=[];

	this.pilaresActivos = 0;

	this.cristalesActivos = 0;

	this.personaje={};

	this.marcaMouse={};

	this.nombreCanvas='myCanvas';

	this.enemySpawnTime = 600;

	this.nextEnemySpawn = 0;

	this.nivelActual = 1;

	this.entidadesFactory = [];

	this.isGUI = true;
}

GameEngineClass.prototype.setup = function () {

    // Create physics engine
    gPhysicsEngine.create();

    // Add contact listener
    gPhysicsEngine.addContactListener({

        BeginContact: function (bodyA, bodyB) {
            var uA = bodyA ? bodyA.GetUserData() : null;
            var uB = bodyB ? bodyB.GetUserData() : null;

            if (uA !== null) {
                if (uA.ent !== null && uA.ent.onTouch) {
                    uA.ent.onTouch(bodyB, null);
                }
            }

            if (uB !== null) {
                if (uB.ent !== null && uB.ent.onTouch) {
                    uB.ent.onTouch(bodyA, null);
                }
            }
        },

        EndContact: function(bodyA, bodyB) {
            var uA = bodyA ? bodyA.GetUserData() : null;
            var uB = bodyB ? bodyB.GetUserData() : null;

            if (uA !== null) {
                if (uA.ent !== null && uA.ent.endTouch) {
                    uA.ent.endTouch(bodyB, null);
                }
            }

            if (uB !== null) {
                if (uB.ent !== null && uB.ent.endTouch) {
                    uB.ent.endTouch(bodyA, null);
                }
            }
        },
    });

}

GameEngineClass.prototype.constructor = GameEngineClass;
	// Metodo invocado cuando se terminan de cargar los sprites
GameEngineClass.prototype.callbackIniciar = function(){
	if(GE.isGUI){
		GE.nuevoGUI("InicioGUI");
	}else{
		GE.nuevoNivel();
	}	
	/** Inicio de la sección para preparar un gameLoop eficiente **/
	var animFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        null;

    if ( animFrame !== null ) {

    	// Metodo recursivo controlado por el navegador, para hacer invocaciones de animaciones eficientemente
        var recursiveLoop = function() {
            //Tick del gameLoop
            GE.tick();
            //Se invoca el siguiente Tick del gameLoop, utilizando requestAnimationFrame o el disponible
            animFrame( recursiveLoop );
        };

        // Iniciamos el Game Loop
        animFrame( recursiveLoop );
    } else {
    	// Si no está disponible ninguna versión del requestAnimationFrame, se inicia el gameloop con setInterval
        var ONE_FRAME_TIME = 1000.0 / 60.0 ;
        setInterval( GE.tick, ONE_FRAME_TIME );
    }

    gInputEngine.setup();

    /** Fin de preparación del gameLoop **/
	
}

GameEngineClass.prototype.init=function(){
	this.canvasObj = document.getElementById("myCanvas");
	this.canvasObj.width = this.canvasSize.w;
	this.canvasObj.height = this.canvasSize.h;
	GE.ctx = this.canvasObj.getContext("2d");
	loadSprites("img/spriteSheetMap.json", GE.cargarNiveles);
	// Se inicializa el PhysicsEngine
	this.setup();
}

GameEngineClass.prototype.cargarNiveles = function(){
	cargarNivelesJSON("js/Levels/Niveles.json",GE.callbackIniciar);
}

GameEngineClass.prototype.nivelSuperado = function(){
	//alert("Level Cleared");
	this.nivelActual++;
	this.nuevoGUI("SuperadoGUI");
	this.isGUI=true;
}

GameEngineClass.prototype.nivelPerdido = function(){
	//alert("GameOver try again...");
	this.nuevoGUI("PerdisteGUI");
	this.isGUI=true;
}

GameEngineClass.prototype.nuevoNivel = function(){
	var nivelCargar = niveles[this.nivelActual];

	//Limpiamos todo lo del nivel anterior
	for (var j = 0; j < this.entities.length; j++) {
		if(this.entities[j].physBody) gPhysicsEngine.removeBody(this.entities[j].physBody);
        this.entities.removeObj(this.entities[j]);
    }

	this.entities = [];
	this.pilaresActivos=0;
	this.cristalesActivos=0;
	this.personaje = {};

	for(var i=0; i<nivelCargar.entidades.length; i++){
		var entidadNueva = new this.entidadesFactory[nivelCargar.entidades[i].type](nivelCargar.entidades[i]);
		if(entidadNueva instanceof PilarClass){
			this.pilaresActivos++;
		}else if (entidadNueva instanceof CristalClass) {
			this.cristalesActivos++;
		}else if (entidadNueva instanceof PlayerClass) {
			this.personaje = entidadNueva;
		}
		this.entities.push(entidadNueva);
	}

}

GameEngineClass.prototype.nuevoGUI = function(nombreGUI){
	var nivelCargar = niveles[nombreGUI];

	//Limpiamos todo lo del nivel anterior
	for (var j = 0; j < this.entities.length; j++) {
		if(this.entities[j].physBody) gPhysicsEngine.removeBody(this.entities[j].physBody);
        this.entities.removeObj(this.entities[j]);
    }

	this.entities = [];
	this.pilaresActivos=0;
	this.cristalesActivos=0;
	this.personaje = {};

	for(var i=0; i<nivelCargar.entidades.length; i++){
		var entidadNueva = new GUIEntityClass(nivelCargar.entidades[i]);
		this.entities.push(entidadNueva);
	}

}

GameEngineClass.prototype.tick = function() {

	// Iniciamos el monitoreo
	stats.begin();

	if(!this.isGUI){
		if(this.cristalesActivos<1){
			this.nivelSuperado();	
		}else if(this.personaje && this.personaje!=null && this.personaje instanceof PlayerClass && this.personaje.isDead==false){

		}else{
			this.nivelPerdido();
		}
	}

	GE.updateGame();
	GE.drawGame();

    //Finalizamos el monitoreo
    stats.end();
}

GameEngineClass.prototype.updateGame=function(){


	var entidadesEliminar = [];
	GE.entities.forEach(function(entidad) {
		if(entidad.isDead==true){
			entidadesEliminar.push(entidad);
		}else{
			entidad.update();
		}
	});
	
	for (var j = 0; j < entidadesEliminar.length; j++) {
		if(entidadesEliminar[j].physBody) gPhysicsEngine.removeBody(entidadesEliminar[j].physBody);
        this.entities.removeObj(entidadesEliminar[j]);
    }

	gPhysicsEngine.update();

	//Validamos si es momento de generar un nuevo enemigo
	//if(this.nextEnemySpawn===0) this.spawnEnemy();
}

GameEngineClass.prototype.drawGame=function(){
	var pisoSprite = findSprite(pisoSpriteName);
	for(var i=0;i<this.canvasSize.w; i+=pisoSprite.w){
		for(var j=0;j<this.canvasSize.h; j+=pisoSprite.h){
			pintarSprite(pisoSpriteName,i,j);
		}
	}

	GE.entities.forEach(function(entidad) {
		entidad.draw();
	});
}

GameEngineClass.prototype.spawnEnemy = function(){
	var nuevoEnemigo = new EnemyClass({x:0, y:0});
	this.nextEnemySpawn=this.enemySpawnTime;
	this.entities.push(nuevoEnemigo);
}


GE = new GameEngineClass();
GE.entidadesFactory["GuardianClass"]=GuardianClass;
GE.entidadesFactory["PlayerClass"]=PlayerClass;
GE.entidadesFactory["PilarClass"]=PilarClass;
GE.entidadesFactory["CristalClass"]=CristalClass;

GE.init();

/*
var nuevoEnemigo = new GuardianClass({x:100, y:100}, {x:200, y:100});
GE.entities.push(nuevoEnemigo);
*/