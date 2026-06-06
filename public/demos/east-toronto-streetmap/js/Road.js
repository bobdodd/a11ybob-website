//-----------------------------------------------
// Road
//-----------------------------------------------

class Road {

    static roads = [];

    constructor(id, coords, type, name, oneway, service, foot, motorcar, bicycle, footway, maxspeed, lanes, sidewalk) {
        this.id = id;
        this.coords = coords;
        this.type = type;
        this.name = name;
        this.oneway = oneway;
        this.service = service;
        this.foot = foot;
        this.motorcar = motorcar;
        this.bicycle = bicycle;
        this.footway = footway;
        this.footway = maxspeed;
        this.footway = lanes;
        this.footway = sidewalk;

        OsmId.add(id, "Road");
        Road.roads.push(this);

        if (name !== null) {
            const nr = new NamedRoad(id, coords, type, name, oneway, service, foot, motorcar, bicycle, footway, maxspeed, lanes, sidewalk);
        }
    }

}
