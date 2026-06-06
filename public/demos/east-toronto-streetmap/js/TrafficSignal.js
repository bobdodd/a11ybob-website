//---------------------------------
// TrafficSignal
//---------------------------------

class TrafficSignal {

    static signals = [];

    // Attribtes
    //  
    // coords { x, y }


    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;

        OsmId.add(id, "TrafficSignal");
        TrafficSignal.signals.push(this);
    }

};
