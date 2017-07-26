CamaraClass = function(camSize, target) {

    // Tamanio de la camara, deberia ser siempre del mismo tamanio que el canvas
    this.size = { h: camSize.h, w: camSize.w };

    //la posición de la camara la ubicamos por defecto en el centro del mundo
    this.pos = { x: this.size.h / 2, y: this.size.w / 2 };

    //Valor calculado que se deben desplazar los sprites, para ajustarse a la porción visible de la camara
    this.offset = { "x": 0, "y": 0 };

    //Booleano que indica si la camara sigue un objetivo
    this.perseguir = false;

    // Objeto de tipo entity, que seguirá la camara si el atributo perseguir es true
    this.objetivo = null;

    // Pixeles de libertad que se le permiten al objetivo sobre la camara, 
    // La camara solo se mueve si la diferencia entre las posiciones es mayor a este valor, para cada componente.
    this.libertadObjetivo = { "x": 16, "y": 16 };

    //Limite de movimiento de la camara, permite indicar la maxima distancia en X y Y a la que se puede mover la camara
    //Actualmente no soporta valores inferiores a 0. 
    this.limite = { "x": 2000, "y": 1100 };

    // TODO: Velocidad de la camara para seguir al objetivo
    this.velocidad = { "x": 500, "y": 500 };

    if (target != null) {
        this.perseguir = true;
        this.objetivo = target;
    }

    //this.limite = { x: this.size.h / 2, y: this.size.w / 2 };

}

CamaraClass.prototype.constructor = CamaraClass;

CamaraClass.prototype.update = function() {

    if (this.perseguir == true) {

        if (Math.abs(this.objetivo.pos.x - this.pos.x) > this.libertadObjetivo.x) {

            if (this.objetivo.pos.x - this.pos.x > 0) {
                this.pos.x += (this.objetivo.pos.x - this.pos.x - this.libertadObjetivo.x) % this.velocidad.x;
            } else {
                this.pos.x += (this.objetivo.pos.x - this.pos.x + this.libertadObjetivo.x) % this.velocidad.x;
            }

            if (this.pos.x < this.size.h / 2) {
                this.pos.x = this.size.h / 2;
            }
            if (this.pos.x > this.limite.x) {
                this.pos.x = this.limite.x;
            }

        }

        if (Math.abs(this.objetivo.pos.y - this.pos.y) > this.libertadObjetivo.y) {

            if (this.objetivo.pos.y - this.pos.y > 0) {
                this.pos.y += (this.objetivo.pos.y - this.pos.y - this.libertadObjetivo.y) % this.velocidad.y;
            } else {
                this.pos.y += (this.objetivo.pos.y - this.pos.y + this.libertadObjetivo.y) % this.velocidad.y;
            }

            if (this.pos.y < this.size.w / 2) {
                this.pos.y = this.size.w / 2;
            }
            if (this.pos.y > this.limite.y) {
                this.pos.y = this.limite.y;
            }

        }

        this.offset = { "x": (this.pos.x - (this.size.h / 2)), "y": (this.pos.y - (this.size.w / 2)) };

    }
}

CamaraClass.prototype.seguir = function(target) {

    this.perseguir = true;
    this.objetivo = target;
    this.pos = { "x": this.objetivo.pos.x, "y": this.objetivo.pos.y };

}

// Deja de seguir al objetivo actual, se debe posicionar la camara
CamaraClass.prototype.noSeguir = function(nuevaPos) {

    this.perseguir = false;
    this.objetivo = null;

    this.pos.x = nuevaPos.x;
    this.pos.y = nuevaPos.y;

}