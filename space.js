// var Position = require('./Position');
// var Rotation = require('./Rotation');
// var Angle = require('./Angle')
// var CelestialObject = require('./CelestialObject');
// var ViewPort = require('./Viewport');

const sunRadius = 432288; //miles

var viewPort = new ViewPort(new Position(0, 0, 0), new Rotation(0, 0, 0), 90);
// viewPort.fieldOfView = 70;
// viewPort = new ViewPort(new Position(0, 0, 500000000), new Rotation(0, 0, -90), 135);
var celestialObjects = [];

function createSolarSystem(viewPort) {
	// viewPort.position.x = -92960000;
	viewPort.position = getOrbitalPoint(new Position(0,0,0), 92960000, 180, 0);
	// viewPort.position.z = 900000000;
	// viewPort.rotation.z = -90;
	// viewPort.rotation.z = 10;

	var sun = new Star('Sun', 'yellow', sunRadius, {x: 0, y: 0, z: 0});
	var mercury = new Planet('Mercury', 'gray', 3032, getOrbitalPoint(sun.position, million(35.98), 90, 0));
	var venus = new Planet('Venus', '#f6d8a5', 6052, getOrbitalPoint(sun.position, 67237910, 140, 0));
	var earth = new Planet('Earth', '#89a1e9', 7917.5, getOrbitalPoint(sun.position, 92960000, 179.9, 0));
	var moon = new Planet('Moon', '#F5F3CE', 1079, getOrbitalPoint(earth.position, 238900, 270, 0));
	var mars = new Planet('Mars', '#fb825c', 4212, getOrbitalPoint(sun.position, million(141.6), 220, 0));
	var jupiter = new Planet('Jupiter', '#c78b51', 43411, getOrbitalPoint(sun.position, million(483.8), 260, 0));
	var saturn = new Planet('Saturn', '#aa9f34', 72367.4, getOrbitalPoint(sun.position, million(890.7), 300, 0));
	var uranus = new Planet('Uranus', '#99fff1', 31518, getOrbitalPoint(sun.position, billion(1.784), -20, 0));
	var neptune = new Planet('Neptune', 'blue', 30559, getOrbitalPoint(sun.position, billion(2.793), 20, 0));
	var pluto = new Planet('Pluto', '#d5b497', 1477, getOrbitalPoint(sun.position, billion(3.67), 60, 0));

	celestialObjects.push(sun);
	celestialObjects.push(mercury);
	celestialObjects.push(venus);
	celestialObjects.push(moon);
	celestialObjects.push(earth);
	celestialObjects.push(mars);
	celestialObjects.push(jupiter);
	celestialObjects.push(saturn);
	celestialObjects.push(uranus);
	celestialObjects.push(neptune);
	celestialObjects.push(pluto);
}

function loadStars() {
	//starData comes from ../data/StarData.js
	for(let i = 1; i < starData.length; i++) {
		var starColor;
		if(starData[i]['True Color'] != '') {
			starColor = starData[i]['True Color'];
		} else {
			starColor = 'white';
		}
		celestialObjects.push(new Star(
			starData[i]['Common Names'].split(';')[0],
			starColor,
			sunRadius * starData[i]['Radius (Sun)'],
			new Position(
				milesFromParsecs(starData[i]['X']), 
				milesFromParsecs(starData[i]['Y']), 
				milesFromParsecs(starData[i]['Z'])
			),
			starData[i]['Common Names'].split(';').slice(1)
		));
	}
}

createSolarSystem(viewPort);
loadStars();
var selectedObject = celestialObjects[0];

viewPort.render(celestialObjects);