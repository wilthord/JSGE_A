// Version de lector de mapas de tiled, adaptada del curso HTML5 Game Development, encontrado en Udacity

MapLoaderClass = function() {
    // Mapa actual, Json parseado
    this.currMapData = null;

    // Todos los tilesets que hacen parte del mapa actual
    this.tilesets = [];

    // Valores por defecto, se cargan luego con el mapa
    this.numTiles = {
        "x": 100,
        "y": 100
    };

    // Tamaño en pixeles de cada Tile
    this.tileSize = {
        "x": 64,
        "y": 64
    };

    // Tamaño del mapa en pixeles. Es el producto de numTiles * tileSize calculado luego
    this.pixelSize = {
        "x": 64,
        "y": 64
    };

    // Numero de imagenes cargadas
    this.imgLoadCount = 0;

    // Bandera para marcar si ya se cargó el mapa y todos los recursos (Imagenes, tilesets, ...)
    this.fullyLoaded = false;

}


MapLoaderClass.prototype.constructor = MapLoaderClass;

// Descargamos el Json del mapa
MapLoaderClass.prototype.load = function(map) {

    xhrGet(map, function(data) {
        gMap.parseMapJSON(data.currentTarget.responseText);
    });
}


// Hacemos el parseo del mapa
MapLoaderClass.prototype.parseMapJSON = function(mapJSON) {
    gMap.currMapData = JSON.parse(mapJSON);

    var map = gMap.currMapData;

    // Width y Height contiene el numero de tiles del mapa
    gMap.numTiles.x = map.width;
    gMap.numTiles.y = map.height;

    // Establecemos el tamaño en pixeles de cada tile
    gMap.tileSize.x = map.tilewidth;
    gMap.tileSize.y = map.tileheight;

    // Establecemos el tamaño del mapa en pixeles
    gMap.pixelSize.x = gMap.numTiles.x * gMap.tileSize.x;
    gMap.pixelSize.y = gMap.numTiles.y * gMap.tileSize.y;

    // Loop through 'map.tilesets', an Array...
    for (var i = 0; i < map.tilesets.length; i++) {

        // Cargamos todos los tilesets
        var img = new Image();
        img.onload = function() {

            //Aumentamos la cantidad de imagenes cargadas, cuando finaliza la carga
            gMap.imgLoadCount++;
            if (gMap.imgLoadCount === map.tilesets.length) {
                // Marcamos el fin de la carga de los tilesets
                gMap.fullyLoaded = true;
            }
        };

        img.src = map.tilesets[i].image;

        // Objeto de tipo tileset, para almacenar todos los datos
        var ts = {
            "firstgid": gMap.currMapData.tilesets[i].firstgid,
            "image": img,
            "imageheight": gMap.currMapData.tilesets[i].imageheight,
            "imagewidth": gMap.currMapData.tilesets[i].imagewidth,
            "name": gMap.currMapData.tilesets[i].name,

            // Calculamos el numero de tiles en el tileset, dividiendo el tamanio de la imagen, entre el tamaño en pixeles de cada tile
            "numXTiles": Math.floor(gMap.currMapData.tilesets[i].imagewidth / gMap.tileSize.x),
            "numYTiles": Math.floor(gMap.currMapData.tilesets[i].imageheight / gMap.tileSize.y)
        };

        // Guardamos el tileset en el arreglo de tilesets cargados
        gMap.tilesets.push(ts);
    }

    for (var layerIdx = 0; layerIdx < map.layers.length; layerIdx++) {

        //Solo recorremos las capas de objetos
        if(map.layers[layerIdx].type!="objectgroup"){
            continue;
        }

        for(var j = 0; j<map.layers[layerIdx].objects.length; j++){
            if(map.layers[layerIdx].objects[j].type == "PisoObj"){
                GE.entities.push(new PisoClass(map.layers[layerIdx].objects[j]));
            }
        }

    }


}

//-----------------------------------------
// Retorna un objeto con la imagen y la posición en pixeles, donde se encuentra el tile buscado
MapLoaderClass.prototype.getTilePacket = function(tileIndex) {

    var pkt = {
        "img": null,
        "px": 0,
        "py": 0
    };

    // Buscamos el tileset, donde se encuentra el tile requerido
    // Lo logramos recorriendo todos los tilesets, si el id del primer tile (Firstgid) es menor o igual al que buscamos, 
    // entonces nuestro tile se encuentra en este tileset. Debido a que los tilesets se organizan de acuerdo a su id, de menor a mayor.
    // Los recorremos en orden inverso, para evitar validaciones extra cuando solo hay un tileset
    var tile = 0;
    for (tile = gMap.tilesets.length - 1; tile >= 0; tile--) {
        if (gMap.tilesets[tile].firstgid <= tileIndex) break;
    }

    // Guardamos la imagen del tileset donde se encuentra nuestro tile
    pkt.img = gMap.tilesets[tile].image;


    // tenemos que restar el indice del tile buscado, menos el firstgid del tileset,
    // para obtener el indice real dentro del tileset, porque el tiled le agrega un valor 
    // para que no se repitan los tileIds entre los diferentes tilesets
    // el localIdx es el indice real, que nos permite encontrar el tile, dentro de el tileset respectivo.
    var localIdx = tileIndex - gMap.tilesets[tile].firstgid;

    // Calculamos la cordenada X y Y del tile dentro del tilset.
    var lTileX = Math.floor(localIdx % gMap.tilesets[tile].numXTiles);
    var lTileY = Math.floor(localIdx / gMap.tilesets[tile].numXTiles);

    // Calculamos la posicion inicial en pixeles, de nuestro tile en la imagen (tileset)
    pkt.px = (lTileX * gMap.tileSize.x);
    pkt.py = (lTileY * gMap.tileSize.y);


    return pkt;
}

// pintamos el mapa
MapLoaderClass.prototype.draw = function(ctx) {
    // solo pintamos el mapa si todas las imagenes estan cargadas
    if (!gMap.fullyLoaded) return;

    // recorremos todas las capas en el mapa
    for (var layerIdx = 0; layerIdx < gMap.currMapData.layers.length; layerIdx++) {

        // solo pintamos las capas de tipo 'tilelayer'
        if (gMap.currMapData.layers[layerIdx].type != "tilelayer") continue;

        // elemento en el cual se encuentran identificados los tiles en cada posición del mapa.
        var dat = gMap.currMapData.layers[layerIdx].data;

        for (var tileIDX = 0; tileIDX < dat.length; tileIDX++) {

            // Si el tileIndex es cero no pintamos nada, así que continuamos
            var tID = dat[tileIDX];
            if (tID === 0) continue;

            // Buscamos el tile ( "Sprite" ) correspondiente, en el tileset
            var tPKT = gMap.getTilePacket(tID);

            // Calculamos la posicion en el mundo, en la cual debemos pintar el tile
            var worldX = Math.floor(tileIDX % this.numTiles.x) * this.tileSize.x;
            var worldY = Math.floor(tileIDX / this.numTiles.y) * this.tileSize.y;

            if (worldX - GE.camara.offset.x < -64 || worldX - GE.camara.offset.x > GE.canvasSize.w) {
                continue;
            }

            if (worldY - GE.camara.offset.y < -64 || worldY - GE.camara.offset.y > GE.canvasSize.h) {
                continue;
            }

            //Pintamos el tile
            ctx.drawImage(tPKT.img, tPKT.px, tPKT.py,
                this.tileSize.x, this.tileSize.y,
                worldX - GE.camara.offset.x, worldY - GE.camara.offset.y,
                this.tileSize.x, this.tileSize.y);

        }
    }
}

var gMap = new MapLoaderClass();