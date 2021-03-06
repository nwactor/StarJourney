function auFromMiles(miles) {
	return miles * (1.07578 * Math.pow(10, -8));
}

function lyFromMiles(miles) {
	return miles * (1.70108 * Math.pow(10, -13));
}

function parsecsFromMiles(miles) {
	return lyFromMiles(miles) * 0.306601;
}

function milesFromLY(ly) {
	return ly * 5878600000000;
}

function kmFromLY(ly) {
	return ly * 9460730472580.8;
}

function parsecsFromLY() {
	return 
}

function milesFromParsecs(parsecs) {
	return milesFromLY(lyFromParsecs(parsecs));
	// return miles * 19173513058736;
}

function lyFromParsecs(parsecs) {
	return parsecs * 3.26156;
}

function million(number) {
	return number * 1000000;
}

function billion(number) {
	return number * 1000000000;
}

function getEquivalentAngle(angle) {
	if(angle <= 0) {
		return 360 + angle;
	} else {
		return angle - 360;
	}
}

//Needed to account for slight rounding errors in the conversion between radians and degrees
function isSinZero(angle) {
	return angle % 180 == 0;
}

//Needed to account for slight rounding errors in the conversion between radians and degrees
function isCosZero(angle) {
	return (angle % 270 == 0 && angle != 0) || (angle % 90 == 0 && angle % 180 != 0);
}

//basically spherical coord to 3d coord
//WHEN RUNNING BACK THRU VIEWPORT FUNCTIONS IT'S OFF BY A FACTOR OF AROUND 10%,
//PROBABLY DUE TO ROUNDING ERRORS, WHICH SUCKS. SO I SHOULD ADD A SPHERICAL COORD
//FIELD TO CELESTIALOBJECT WHICH INCLUDES AN ORIGIN SO IT CAN JUST CHECK FOR
//THAT IN VIEWPORT.get2DPositionCoordinates AND DOESN'T HAVE TO GO THRU MULTIPLE CONVERSIONS
function getOrbitalPoint(origin, distance, hAngle, vAngle) {
	let zPos = origin.z + Math.sin(degreesToRadians(vAngle)) * distance;
	if(isSinZero(vAngle)) { zPos = origin.z; }

	let hDistance = Math.cos(degreesToRadians(vAngle)) * distance;
	if(isCosZero(vAngle)) { hDistance = 0; } //account for rounding error
	
	let xPos = origin.x + Math.cos(degreesToRadians(hAngle)) * hDistance;
	if(isCosZero(hAngle)) { xPos = origin.x; }
	
	let yPos = origin.y + Math.sin(degreesToRadians(hAngle)) * hDistance;	
	if(isSinZero(hAngle)) { yPos = origin.y; }

	return new Position(xPos, yPos, zPos);
}