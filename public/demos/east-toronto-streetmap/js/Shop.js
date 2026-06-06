class Shop {

    static shops = [];

    // Attribtes
    //  
    // coords { x, y }


    constructor(id, x, y, type, houseNumber, name, city, street, openingHours, takeaway, dispensing, healthcare, beauty, website, healthcareSpeciality, postcode, phone, unit, province, outdoorSeating, delivery) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = type;
        this.houseNumber = houseNumber;
        this.name = name;
        this.city = city;
        this.street = street;
        this.openingHours = openingHours;
        this.takeaway = takeaway;
        this.dispensing = dispensing;
        this.healthcare = healthcare;
        this.beauty = beauty;
        this.website = website;
        this.healthcareSpeciality = healthcareSpeciality;
        this.postcode = postcode;
        this.phone = phone;
        this.unit = unit;
        this.province = province;
        this.outdoorSeating = outdoorSeating;
        this.delivery = delivery;

        OsmId.add(id, "Shop");
        Shop.shops.push(this);
    }

};
