class BusStop {

    static stops = [];

    // Attribtes
    //  
    // coords { x, y }


    constructor(id, x, y, operator, publicTransport, shelter, bus, network, network_wikidata, network_wikipedia, trafficSignals, name, wheelchair, routeRef, wheelchairDescription, tram, ref) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.publicTransport = publicTransport;
        this.shelter = shelter;
        this.bus = bus;
        this.network = network;
        this.network_wikidata = network_wikidata;
        this.network_wikipedia = network_wikipedia;
        this.trafficSignals = trafficSignals;
        this.name = name;
        this.wheelchair = wheelchair;
        this.routeRef = routeRef;
        this.wheelchairDescription = wheelchairDescription;
        this.tram = tram;
        this.ref = ref;

        if (!TransitOperator.operators.includes(operator)) {
            const to = new TransitOperator(operator);
        }
        this.operator = TransitOperator.operators[operator];

        OsmId.add(id, "BusStop");
        BusStop.stops.push(this);
    }

};
