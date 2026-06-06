class Geometry {

    ///////////////////////////////////////////////////////////////////////
    // Init Map Geometry
    ///////////////////////////////////////////////////////////////////////

    static initMapGeometery() {

        window.mapGeometry = {};

        window.mapGeometry.x1 = -79.3006;
        window.mapGeometry.x2 = -79.2806;
        window.mapGeometry.y1 = 43.6857;
        window.mapGeometry.y2 = 43.6773;

        window.mapGeometry.devW = 800;
        window.mapGeometry.devH = 336;

        window.mapGeometry.mapW = Math.abs(window.mapGeometry.x2 - window.mapGeometry.x1);
        window.mapGeometry.mapH = Math.abs(window.mapGeometry.y2 - window.mapGeometry.y1);
        window.mapGeometry.mapProp = window.mapGeometry.mapH / window.mapGeometry.mapW;
    }

    ///////////////////////////////////////////////////////////////////////
    // Mapping Translations
    ///////////////////////////////////////////////////////////////////////

    static translateToDevice(x, y) {
        const xRel = (x - window.mapGeometry.x1) / window.mapGeometry.mapW * window.mapGeometry.devW + 120;
        const yRel = ((window.mapGeometry.y1 - y) / window.mapGeometry.mapH * window.mapGeometry.devH) + 150;
        const result = { "x": xRel, "y": yRel };
        return result;
    }

    static translateToMap(x, y) {
        let xRel = x / window.mapGeometry.devW * window.mapGeometry.mapW;
        let yRel = (window.mapGeometry.devH - y) / window.mapGeometry.devH * window.mapGeometry.mapH;
        return { "x": window.mapGeometry.x1 + xRel, "y": window.mapGeometry.y2 + yRel };
    }

    static mouseToMapOnClick(evt) {

        let mouseX = evt.clientX;
        let mouseY = evt.clientY;

        let map = document.getElementById("map");
        let r = map.getBoundingClientRect();
    
        let x = (mouseX - r.left);
        let y = (mouseY - r.top);
    
        let mapCoords = Geometry.translateToMap(x, y);
        console.log("M " + mapCoords.x + ", " + mapCoords.y);

    } 

};


