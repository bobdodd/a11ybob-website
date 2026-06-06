//-----------------------------------------------------
// Leisure
//-----------------------------------------------------

class Leisure {

    static leisures = [];

    constructor(id, geom, houseNumber, name, operator, sport, leisure, city, street, postcode, socialFacility, phone, socialFacilityFor) {
        this.id = id;
        this.houseNumber = houseNumber;
        this.name = name;
        this.operator = operator;
        this.sport = sport;
        this.leisure = leisure;
        this.city = city;
        this.street = street;
        this.postcode = postcode;
        this.socialFacility = socialFacility;
        this.phone = phone;
        this.socialFacilityFor = socialFacilityFor;
        this.geom = geom;

        OsmId.add(id, "Leisure");
        Leisure.leisures.push(this);

    }
}
