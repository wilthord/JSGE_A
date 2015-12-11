EntityClass = function(){
    
    this.pos = new b2Vec2(0,0),
    this.size = {x:0,y:0},
    this.last = new b2Vec2(0,0),
    this.currSpriteName = null;
    this.zindex = 0;                  //entero que indica en que orden se pintará la entidad
    this.isDead = false;
    this.w = 1;
    this.h = 1;

    this.angulo=0;
}

// Metodos que deben ser sobrecargados por todas las clases hijas
// Se ejecuta en cada tick, actualiza la entidad de acuerdo a sus acciones, IA o fisica
EntityClass.prototype.update = function() { }

//Pinta la entidad en la escena. es invocado por el GameEngine
EntityClass.prototype.draw = function() { 
        pintarSpriteCustom(this.currSpriteName, this.pos.x, this.pos.y, this.w, this.h, this.angulo);
}