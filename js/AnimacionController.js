//Mapa de todas las Animaciones
animacionesMap={};

AnimacionesController = function(){


}

AnimacionesController.prototype.constructor = AnimacionesController;

AnimacionesController.prototype.defAnimacion = function (nombreAnim, spritesAnim) {

    var anim = new Animacion();
    
    anim.id=nombreAnim;
    anim.numFrames=spritesAnim.length;
    anim.sprites=spritesAnim;

    animacionesMap[nombreAnim]=anim;

}


AnimacionesController.prototype.getAnimacion = function (nombreAnim) {

    return animacionesMap[nombreAnim];

}