
//---------------------------------
// Address
//---------------------------------

class Address {

    static addresses = [];

    constructor(id, x, y, unit, houseNumber, city, street, postcode, phone) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.unit = unit;
        this.houseNumber = houseNumber;
        this.street = street;
        this.city = city;
        this.postcode = postcode;
        this.phone = phone;

        OsmId.add(id, "Address");
        Address.addresses.push(this);
    }

};
