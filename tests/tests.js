viewPort = new ViewPort(new Position(0, 0, 0), new Rotation(0, 0, 0), 135);
celestialObjects = [];

function testObjects() {
	var p1 = new Position(0, 0, 0);
	var p2 = new Position(11, 1, 1);

	var moon = new CelestialObject('moon', '#F5F3CE', 1079, {x: 0, y: 0, z: 238900});
	var sun = new CelestialObject('sun', 'yellow', 432288, {x: 0, y: 0, z: 92960000});
	var jupiter = new CelestialObject('jupiter', 'orange', 43411, {x: 0, y: 0, z: 365000000});
	var venus = new CelestialObject('venus', 'yellow', 6052, {x: 0, y: 0, z: 38000000});

	var aCentauri = new CelestialObject('Alpha Centauri', '#99fff1', 528861, {x: 0, y: 0, z: milesFromLY(4.367)});

	console.log(`Moon apparent size: ${moon.getApparentSize(p1).arc}`);
	console.log(`Sun apparent size: ${sun.getApparentSize(p1).arc}`);
	console.log(`Jupiter apparent size: ${jupiter.getApparentSize(p1).arc}`);
	console.log(`Venus apparent size: ${venus.getApparentSize(p1).arc}`);
	console.log(`Alpha Centauri apparent size: ${aCentauri.getApparentSize(p1).arc}`);
}

function testViewport(viewPort) {
	viewPort = new ViewPort(new Position(0, 0, 0), new Rotation(0, 0, 0), 135);
	
	var moon = new CelestialObject('moon', '#F5F3CE', 1079, {x: 238900, y: 238900, z: 0});
	var sun = new CelestialObject('sun', 'yellow', 432288, {x: 92960000, y: -500000, z: 9296000});
	var jupiter = new CelestialObject('jupiter', 'orange', 43411, {x: 365000000, y: -365000000, z: 0});
	var venus = new CelestialObject('venus', 'brown', 6052, {x: 38000000, y: 3800000, z: -500000});

	var aCentauri = new CelestialObject('Alpha Centauri', '#99fff1', 528861, {x: milesFromLY(4.367), y: 0, z: 0});

	celestialObjects.push(moon);
	celestialObjects.push(sun);
	celestialObjects.push(venus);
	celestialObjects.push(jupiter);
	celestialObjects.push(aCentauri);
	
	viewPort.render(celestialObjects);
}

// testObjects();
// testViewport(viewPort);

function testOrbits(viewPort) {
	var red = new CelestialObject('red', 'red', 1, getOrbitalPoint(viewPort.position, 10, 0, 0));
	var blue = new CelestialObject('blue', 'blue', 1, getOrbitalPoint(viewPort.position, 10, 60, 0));
	var green = new CelestialObject('green', 'green', 1, getOrbitalPoint(viewPort.position, 10, 120, 0));
	var yellow = new CelestialObject('yellow', 'yellow', 1, getOrbitalPoint(viewPort.position, 10, 180, 0));
	var orange = new CelestialObject('orange', 'orange', 1, getOrbitalPoint(viewPort.position, 10, -120, 0));
	var purple = new CelestialObject('purple', 'purple', 1, getOrbitalPoint(viewPort.position, 10, -60, 0));

	// console.log("red expected:");
	// console.log("");
	// console.log("red actual:");
	// console.log(red.position);
	
	console.log("blue expected:");
	console.log("");
	console.log("blue actual:");
	console.log(blue.position);
	
	// console.log("green expected:");
	// console.log("");
	// console.log("green actual:");
	// console.log(green.position);
	
	// console.log("yellow expected:");
	// console.log("");
	// console.log("yellow actual:");
	// console.log(yellow.position);
	
	// console.log("orange expected:");
	// console.log("");
	// console.log("orange actual:");
	// console.log(orange.position);
	
	// console.log("purple expected:");
	// console.log("");
	// console.log("purple actual:");
	// console.log(purple.position);

	celestialObjects.push(red);
	celestialObjects.push(blue);
	celestialObjects.push(green);
	celestialObjects.push(yellow);
	celestialObjects.push(orange);
	celestialObjects.push(purple);

	viewPort.render(celestialObjects)
}

// testOrbits(viewPort);

function testDistances(viewPort) {
	var sun = new CelestialObject('Sun', 'yellow', sunRadius, {x: 0, y: 0, z: 0});
	var mercury = new CelestialObject('Mercury', 'gray', 3032, getOrbitalPoint(sun.position, million(35.98), 0, 0));
	var venus = new CelestialObject('Venus', '#f6d8a5', 6052, getOrbitalPoint(sun.position, 67237910, 0, 0));
	var earth = new CelestialObject('Earth', '#89a1e9', 7917.5, getOrbitalPoint(sun.position, 92960000, 0, 0));
	var moon = new CelestialObject('Moon', '#F5F3CE', 1079, getOrbitalPoint(earth.position, 238900, 270, 0));
	var mars = new CelestialObject('Mars', '#fb825c', 4212, getOrbitalPoint(sun.position, million(141.6), 0, 0));
	var jupiter = new CelestialObject('Jupiter', '#c78b51', 43411, getOrbitalPoint(sun.position, million(483.8), 0, 0));
	var saturn = new CelestialObject('Saturn', '#aa9f34', 72367.4, getOrbitalPoint(sun.position, million(890.7), 0, 0));
	var uranus = new CelestialObject('Uranus', '#99fff1', 31518, getOrbitalPoint(sun.position, billion(1.784), 0, 0));
	var neptune = new CelestialObject('Neptune', 'blue', 30559, getOrbitalPoint(sun.position, billion(2.793), 0, 0));
	var pluto = new CelestialObject('Pluto', '#d5b497', 1477, getOrbitalPoint(sun.position, billion(3.67), 0, 0));

	celestialObjects.push(sun);
	celestialObjects.push(mercury);
	celestialObjects.push(venus);
	celestialObjects.push(earth);
	celestialObjects.push(moon);
	celestialObjects.push(mars);
	celestialObjects.push(jupiter);
	celestialObjects.push(saturn);
	celestialObjects.push(uranus);
	celestialObjects.push(neptune);
	celestialObjects.push(pluto);
}

// testDistances(viewPort);

function testFullView(viewPort) {
	viewPort.rotation.y = 0;
	viewPort.rotation.z = 0;
	viewPort.fieldOfView = 180;
	let center = new Position(0,0,0);
	
	//vertical plane
	var front = new CelestialObject('front', 'red', 1, getOrbitalPoint(center, 20, 0, 0));
	var h0v45 = new CelestialObject('h0v45', 'magenta', 1, getOrbitalPoint(center, 20, 0, 45));
	var top = new CelestialObject('top', 'white', 1, getOrbitalPoint(center, 20, 0, 90));
	var h180v45 = new CelestialObject('h180v45', 'magenta', 1, getOrbitalPoint(center, 20, 180, 45)); //0, 135
	var back = new CelestialObject('back', 'cyan', 1, getOrbitalPoint(center, 20, 0, 180)); // 180, 0
	var h180vn45 = new CelestialObject('h180vn45', 'magenta', 1, getOrbitalPoint(center, 20, 180, -45));
	var bottom = new CelestialObject('bottom', 'orange', 1, getOrbitalPoint(center, 20, 0, -90));
	var h0vn45 = new CelestialObject('h0vn45', 'magenta', 1, getOrbitalPoint(center, 20, 0, -45));

	//horizontal plane
	//front
	var h45v0 = new CelestialObject('h45v0', 'magenta', 1, getOrbitalPoint(center, 20, 45, 0));
	var right = new CelestialObject('right', 'green', 1, getOrbitalPoint(center, 20, 90, 0));
	var h135v0 = new CelestialObject('h135v0', 'magenta', 1, getOrbitalPoint(center, 20, 135, 0));
	//back
	var hn135v0 = new CelestialObject('hn135v0', 'magenta', 1, getOrbitalPoint(center, 20, -135, 0));
	var left = new CelestialObject('left', 'yellow', 1, getOrbitalPoint(center, 20, -90, 0));
	var hn45v0 = new CelestialObject('hn45v0', 'magenta', 1, getOrbitalPoint(center, 20, -45, 0));
	//front

	//perpendicular vertical plane
	var h90v45 = new CelestialObject('h90v45', 'magenta', 1, getOrbitalPoint(center, 20, 90, 45));
	var hn90v45 = new CelestialObject('hn90v45', 'magenta', 1, getOrbitalPoint(center, 20, -90, 45));
	var hn90vn45 = new CelestialObject('hn90vn45', 'magenta', 1, getOrbitalPoint(center, 20, -90, -45));
	var h90vn45 = new CelestialObject('h90vn45', 'magenta', 1, getOrbitalPoint(center, 20, 90, -45));

	celestialObjects.push(front);
	celestialObjects.push(h0v45);
	celestialObjects.push(top);
	celestialObjects.push(h180v45);
	celestialObjects.push(back);
	celestialObjects.push(h180vn45);
	celestialObjects.push(bottom);
	celestialObjects.push(h0vn45);

	celestialObjects.push(h45v0);
	celestialObjects.push(right);
	celestialObjects.push(h135v0);
	celestialObjects.push(hn135v0);
	celestialObjects.push(left);
	celestialObjects.push(hn45v0);

	celestialObjects.push(h90v45);
	celestialObjects.push(hn90v45);
	celestialObjects.push(hn90vn45);
	celestialObjects.push(h90vn45);

	viewPort.render(celestialObjects);
}

testFullView(viewPort);