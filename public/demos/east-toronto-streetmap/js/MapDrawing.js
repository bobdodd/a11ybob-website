class MapDrawing {

    /////////////////////////////////////////////////////////////////////////
    // Label helpers — turn raw OSM tag values into something a user understands.
    // OSM data is sparse: absent tags arrive as null, and "yes" is OSM's generic
    // "it is one of these" (e.g. building=yes). Never expose those raw.
    /////////////////////////////////////////////////////////////////////////

    static humanBuilding(type) {
        const map = {
            yes: "building", house: "house", detached: "detached house",
            semidetached_house: "semi-detached house", apartments: "apartment building",
            terrace: "terraced house", school: "school building",
            retail: "retail building", commercial: "commercial building",
            civic: "civic building", church: "church",
        };
        return map[type] || "building";
    }

    static humanLanduse(use) {
        const map = {
            residential: "residential area", retail: "retail area",
            commercial: "commercial area", industrial: "industrial area",
            religious: "religious grounds", construction: "construction site",
        };
        return map[use] || (use + " area");
    }

    /////////////////////////////////////////////////////////////////////////
    // Landcover
    /////////////////////////////////////////////////////////////////////////

    static drawLandcover() {

        const landcoverFeatures = landcover.features;
        landcoverFeatures.forEach(feature => {
            const geom = feature.geometry;
            if (geom.type === 'Polygon') {
                const coords = geom.coordinates;
                const land = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                let outline = '';
                const innerCoords = coords[0];
                innerCoords.forEach(coord => {
                    const devCoords = Geometry.translateToDevice(coord[0], coord[1]);
                    outline += '' + devCoords.x + ',' + devCoords.y + ' ';
                });

                land.setAttribute('points', outline);
                land.setAttribute('fill', 'smokewhite');
                land.setAttribute('stroke', 'black');
                land.setAttribute('class', 'landOutline');

                const landUse = feature.properties.landuse;
                if (landUse != null && landUse !== '') {
                    land.setAttribute('aria-label', MapDrawing.humanLanduse(landUse));
                } else {
                    // Unknown land use (OSM null) tells the user nothing — keep it
                    // out of the accessibility tree rather than announce "null".
                    land.setAttribute('aria-hidden', 'true');
                }



                map.appendChild(land);
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////
    // Forests
    /////////////////////////////////////////////////////////////////////////
    static drawForests() {
        const forestsFeatures = forests.features;
        forestsFeatures.forEach(feature => {
            const geom = feature.geometry;
            if (geom.type === 'Polygon') {
                const coords = geom.coordinates;
                const forest = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                let outline = '';
                const innerCoords = coords[0];
                innerCoords.forEach(coord => {
                    const devCoords = Geometry.translateToDevice(coord[0], coord[1]);
                    outline += '' + devCoords.x + ',' + devCoords.y + ' ';
                });

                forest.setAttribute('points', outline);
                forest.setAttribute('fill', 'green');
                forest.setAttribute('stroke', 'black');
                forest.setAttribute('class', 'forestOutline');
                const fname = feature.properties.name;
                const fnamed = fname != null && fname !== '' && fname.toLowerCase() !== 'forest';
                forest.setAttribute('aria-label', fnamed ? fname : 'wooded area');

                map.appendChild(forest);
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////
    // Bridges
    /////////////////////////////////////////////////////////////////////////
    static drawBridges() {
        const bridgesFeatures = bridges.features;
        bridgesFeatures.forEach(feature => {
            const geom = feature.geometry;
            if (geom.type === 'LineString') {
                const coords = geom.coordinates;
                const bridge = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                let outline = '';
                coords.forEach(coord => {
                    const devCoords = Geometry.translateToDevice(coord[0], coord[1]);
                    outline += '' + devCoords.x + ',' + devCoords.y + ' ';
                });

                bridge.setAttribute('points', outline);
                bridge.setAttribute('stroke-width', '3');
                bridge.setAttribute('fill', 'none');
                bridge.setAttribute('stroke', 'red');
                bridge.setAttribute('class', 'bridgeOutline');
                bridge.setAttribute('aria-label', 'bridge');

                map.appendChild(bridge);
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////
    // Roads
    /////////////////////////////////////////////////////////////////////////
    static drawRoads() {

        const roadsFeatures = roads.features;
        roadsFeatures.forEach(feature => {
            const geom = feature.geometry;
            if (geom.type === 'LineString') {
                const coords = geom.coordinates;
                const road = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                let outline = '';
                coords.forEach(coord => {
                    const devCoords = Geometry.translateToDevice(coord[0], coord[1]);
                    outline += '' + devCoords.x + ',' + devCoords.y + ' ';
                });

                road.setAttribute('points', outline);
                road.setAttribute('stroke-width', '2');
                road.setAttribute('fill', 'none');
                road.setAttribute('stroke', 'black');
                road.setAttribute('class', 'roadOutline');

                const highway = feature.properties.highway;
                const roadName = feature.properties.name;

                let roadType = "";
                switch (highway.trim()) {
                    case 'primary':     roadType = "main road"; break;
                    case 'tertiary':    roadType = "local road"; break;
                    case 'residential': roadType = "residential road"; break;
                    case 'service':     roadType = "laneway"; break;
                    case 'footway':     roadType = "footway"; break;
                    case 'path':        roadType = "path"; break;
                    case 'steps':
                        roadType = "steps";
                        road.setAttribute('stroke', 'firebrick');
                        break;
                }

                let title;
                if (roadName != null && roadName !== '') {
                    title = roadType ? (roadName + ", " + roadType) : roadName;
                } else {
                    title = roadType || "road";
                }
                road.setAttribute('aria-label', title);

                map.appendChild(road);
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////
    // Amenity Polygons
    /////////////////////////////////////////////////////////////////////////
    static drawAmenityPolygons() {
        const amenityPolygonsFeatures = amenityPolygons.features;
        amenityPolygonsFeatures.forEach(feature => {
            const geom = feature.geometry;
            if (geom.type === 'Polygon') {
                const coords = geom.coordinates;
                const amenity = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                let outline = '';
                const innerCoords = coords[0];
                innerCoords.forEach(coord => {
                    const devCoords = Geometry.translateToDevice(coord[0], coord[1]);
                    outline += '' + devCoords.x + ',' + devCoords.y + ' ';
                });

                amenity.setAttribute('points', outline);
                amenity.setAttribute('stroke-width', '2');
                amenity.setAttribute('fill', 'gray');
                amenity.setAttribute('stroke', 'gray');
                amenity.setAttribute('class', 'amenityPolygonOutline');

                let title = '';

                switch (feature.properties.amenity) {
                    case 'parking':
                        title = 'parking lot';
                        amenity.setAttribute('class', 'parkingOutline');
                        break;
                    case 'place_of_worship':
                        title = 'place of worship';
                        amenity.setAttribute('class', 'worshipOutline');
                        if (feature.properties.denomination !== null) {
                            title += ', ' + feature.properties.denomination;
                        }
                        break;
                    case 'school':
                        title = 'school';
                        amenity.setAttribute('class', 'schoolOutline');
                        if (feature.properties.name !== null) {
                            title += ', ' + feature.properties.name;
                        }
                        break;
                    case 'bicycle_parking':
                        amenity.setAttribute('class', 'bicycleOutline');
                        title = 'bicycle parking';
                        break;
                }

                amenity.setAttribute('aria-label', title);


                map.appendChild(amenity);
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////
    // Buildings
    /////////////////////////////////////////////////////////////////////////

    static drawBuildings() {

        let checkbox = document.querySelector('#checkboxBuildings');
        if (!checkbox.checked) return;

        const buildingsFeatures = buildings.features;
        buildingsFeatures.forEach(feature => {
            const geom = feature.geometry;
            if (geom.type === 'Polygon') {
                const coords = geom.coordinates;
                const building = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                let outline = '';
                const innerCoords = coords[0];
                innerCoords.forEach(coord => {
                    const devCoords = Geometry.translateToDevice(coord[0], coord[1]);
                    outline += '' + devCoords.x + ',' + devCoords.y + ' ';
                });

                building.setAttribute('points', outline);
                building.setAttribute('stroke-width', '2');
                building.setAttribute('fill', 'lightgray');
                building.setAttribute('stroke', 'gray');
                building.setAttribute('class', 'buildingOutline');

                const buildingType = feature.properties.building;
                const buildingName = feature.properties.name;
                const title = (buildingName != null && buildingName !== '')
                    ? buildingName
                    : MapDrawing.humanBuilding(buildingType);

                building.setAttribute('aria-label', title);



                map.appendChild(building);
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////
    // WaterLines
    /////////////////////////////////////////////////////////////////////////
    static drawWaterlines(tabindex) {
        const waterLinesFeatures = waterLines.features;
        waterLinesFeatures.forEach(feature => {
            const geom = feature.geometry;
            if (geom.type === 'LineString') {
                const coords = geom.coordinates;
                const water = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                let outline = '';
                coords.forEach(coord => {
                    const devCoords = Geometry.translateToDevice(coord[0], coord[1]);
                    outline += '' + devCoords.x + ',' + devCoords.y + ' ';
                });

                water.setAttribute('points', outline);
                water.setAttribute('fill', 'none');
                water.setAttribute('stroke', 'blue');
                water.setAttribute('stroke-width', '2');
                water.setAttribute('class', 'waterOutline');
                water.setAttribute('aria-label', feature.properties.waterway);
                map.appendChild(water);

            }
        });
        return tabindex;
    }

    /////////////////////////////////////////////////////////////////////////
    // Addresses
    /////////////////////////////////////////////////////////////////////////
    static drawAddresses() {
        const addressFeatures = addresses.features;
        addressFeatures.forEach(feature => {
            const geom = feature.geometry;

            if (geom.type === 'Point') {

                const coord = geom.coordinates;
                const devCoords = Geometry.translateToDevice(coord[0], coord[1]);

                let postalAddr = '';
                let isShop = false;
                if (feature.properties.shop !== null) {
                    postalAddr += feature.properties.shop;
                    isShop = true;
                    if (feature.properties.name !== null) {
                        postalAddr += ' ' + feature.properties.name;
                    }
                }

                var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                circle.setAttributeNS(null, 'cx', devCoords.x);
                circle.setAttributeNS(null, 'cy', devCoords.y);
                circle.setAttributeNS(null, 'r', '2');

                if (isShop) {
                    circle.setAttribute('fill', 'none');
                    circle.setAttribute('stroke', 'magenta');
                    circle.setAttribute('class', 'shopOutline');
                }
                else {
                    circle.setAttribute('fill', 'blue');
                    circle.setAttribute('stroke', 'blue');
                    circle.setAttribute('class', 'addressOutline');
                }
                circle.setAttribute('stroke-width', '2');

                const hn = feature.properties["addr:housenumber"];
                const st = feature.properties["addr:street"];
                const addr = [hn, st].filter(v => v != null && v !== '').join(' ');
                if (addr) postalAddr = postalAddr ? (postalAddr + ', ' + addr) : addr;
                circle.setAttribute('aria-label', postalAddr || 'address');
                map.appendChild(circle);
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////
    // Stations
    /////////////////////////////////////////////////////////////////////////
    static drawStations() {
        const stationFeatures = stations.features;
        stationFeatures.forEach(feature => {
            const geom = feature.geometry;

            if (geom.type === 'Point') {

                const coord = geom.coordinates;
                const devCoords = Geometry.translateToDevice(coord[0], coord[1]);

                let postalAddr = '';

                if (feature.properties.railway !== null) {
                    if (feature.properties.railway.trim() === 'tram_stop') {
                        postalAddr += 'tram stop';
                    }
                }

                if (feature.properties.highway !== null) {
                    if (feature.properties.highway.trim() === 'bus_stop') {
                        postalAddr += 'bus stop';
                    }
                }
                if (feature.properties.name !== null) {
                    postalAddr += ', ' + feature.properties.name;
                }

                if (feature.properties.shelter !== null) {
                    postalAddr += ', has shelter';
                }

                if (feature.properties.network !== null) {
                    postalAddr += ', ' + feature.properties.network;
                }

                if (feature.properties.ref !== null) {
                    let ref = feature.properties.ref;
                    let i = 0;
                    let firstTime = true;
                    let stretchedRef = '';
                    for (i = 0; i < ref.length; ++i) {
                        if (firstTime) {
                            firstTime = false;
                        }
                        else {
                            stretchedRef += ' ';
                        }
                        stretchedRef += ref[i];
                    }

                    postalAddr += ', stop reference ' + stretchedRef;
                }



                var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                circle.setAttributeNS(null, 'cx', devCoords.x);
                circle.setAttributeNS(null, 'cy', devCoords.y);
                circle.setAttributeNS(null, 'r', '2');

                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', 'gold');

                circle.setAttribute('stroke-width', '2');
                circle.setAttribute('class', 'stationOutline');

                circle.setAttribute('aria-label', postalAddr);
                map.appendChild(circle);
            }
        });
    }

    static drawMap() {

        let tabindex = 10;

        let map = document.querySelector("#map");

        MapDrawing.drawLandcover();
        MapDrawing.drawForests();
        MapDrawing.drawBridges();
        MapDrawing.drawRoads();
        MapDrawing.drawAmenityPolygons();
        MapDrawing.drawBuildings();
        MapDrawing.drawWaterlines(tabindex);
        MapDrawing.drawAddresses();
        MapDrawing.drawStations();

        MapDrawing.setTabOrder();
    }

    static resizeMap() {

        let map = document.querySelector("#map");
        map.style.display = "none";

        const main = document.querySelector("main");
        let ht;
        if (window.innerHeight > window.innerWidth) {
            // Portrait
            ht = window.innerHeight - 70;
            main.style.flexDirection = 'column';
        }
        else {
            // landscape
            ht = window.innerHeight - 20;
            main.style.flexDirection = 'row';
        }

        let dummyDiv = document.querySelector("#dummyDiv");
        const mapWidth = dummyDiv.offsetWidth;
        map.style.display = "block";
        map.setAttribute("width", mapWidth);
        map.setAttribute("height", ht);
        map.setAttribute("viewBox", "0 0 " + mapWidth + " " + ht);
    }


    static setTabOrder() {

        const selectedRotor = document.querySelector('input[name="rotor"]:checked').value;
        console.log('Selected rotor: ' + selectedRotor);

        const landCovers = document.querySelectorAll('.landOutline');
        const forests = document.querySelectorAll('.forestOutline');
        const bridges = document.querySelectorAll('.bridgeOutline');
        const roads = document.querySelectorAll('.roadOutline');
        const amenityPolygons = document.querySelectorAll('.amenityPolygonOutline');
        const buildings = document.querySelectorAll('.buildingOutline');
        const waterlines = document.querySelectorAll('.waterOutline');
        const shops = document.querySelectorAll('.shopOutline');
        const stations = document.querySelectorAll('.stationOutline');

        const parking = document.querySelectorAll('.parkingOutline');
        const worshipping = document.querySelectorAll('.worshipOutline');
        const schools = document.querySelectorAll('.schoolOutline');
        const bicycleParking = document.querySelectorAll('.bicycleOutline');


        landCovers.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        forests.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        bridges.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        roads.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        amenityPolygons.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        buildings.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        waterlines.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        shops.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        stations.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        parking.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        worshipping.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        schools.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        bicycleParking.forEach(elem => {
            elem.removeAttribute('tabindex');
            elem.removeAttribute('role');
        });

        let tabIdx = 100;
        switch (selectedRotor) {

            case 'transit':
                stations.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    tabIdx++;
                });
                break;

            case 'shops':
                shops.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    tabIdx++;
                });
                break;

            case 'schools':
                schools.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    tabIdx++;
                });
                break;

            case 'worship':
                worshipping.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    tabIdx++;
                });
                break;

            case 'parks':
                forests.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    tabIdx++;
                });
                 break;

            case 'dragon':
                stations.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });
                shops.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });
                schools.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });
                worshipping.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });
                forests.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                landCovers.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                bridges.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                roads.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                amenityPolygons.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                buildings.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                waterlines.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                parking.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                parking.forEach(elem => {
                    elem.setAttribute('tabindex', tabIdx.toString());
                    elem.setAttribute('role', "button");
                    tabIdx++;
                });

                break;

        }

    }

};