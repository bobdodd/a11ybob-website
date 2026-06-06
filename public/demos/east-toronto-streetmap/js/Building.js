//-----------------------------------------------------
// Building
//-----------------------------------------------------

class Building {

    static buildings = [];

    constructor(id, geom, type, houseNumber, name, operator, sport, leisure, city, street, postcode, socialFacility, phone, socialFacilityFor) {
        this.id = id;
        this.geom = geom;
        this.type = type;
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

        OsmId.add(id, "Building");
        Building.buildings.push(this);

        if (sport !== null) {
            const sp = new Sport(id, geom, houseNumber, name, operator, sport, leisure, city, street, postcode, socialFacility, phone, socialFacilityFor)
        }

        if (socialFacility !== null) {
            const sp = new SocialFacility(id, geom, houseNumber, name, operator, sport, leisure, city, street, postcode, socialFacility, phone, socialFacilityFor)
        }

        if (leisure !== null) {
            const ls = new Leisure(id, geom, houseNumber, name, operator, sport, leisure, city, street, postcode, socialFacility, phone, socialFacilityFor)
        }

    }
}
