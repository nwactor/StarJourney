function milesFromLY(ly) {
	return ly * 5878600000000;
}

function milesFromParsecs(parsecs) {
	return milesFromLY(lyFromParsecs(parsecs));
}

function lyFromParsecs(parsecs) {
	return parsecs * 3.26156;
}

function kmFromLY(ly) {
	return ly * 9460730472580.8;
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

//basically spherical coord to 3d coord
//WHEN RUNNING BACK THRU VIEWPORT FUNCTIONS IT'S OFF BY A FACTOR OF AROUND 10%,
//PROBABLY DUE TO ROUNDING ERRORS, WHICH SUCKS. SO I SHOULD ADD A SPHERICAL COORD
//FIELD TO CELESTIALOBJECT WHICH INCLUDES AN ORIGIN SO IT CAN JUST CHECK FOR
//THAT IN VIEWPORT.get2DPositionCoordinates AND DOESN'T HAVE TO GO THRU MULTIPLE CONVERSIONS
function getOrbitalPoint(origin, distance, hAngle, vAngle) {
	let zPos = origin.z + Math.sin(degreesToRadians(vAngle)) * distance;
	
	let hDistance = Math.cos(degreesToRadians(vAngle)) * distance;
	let xPos = origin.x + Math.cos(degreesToRadians(hAngle)) * hDistance;
	let yPos = origin.y + Math.sin(degreesToRadians(hAngle)) * hDistance;	

	return new Position(xPos, yPos, zPos);
}

$('#art-button').on('click', () => {
	viewPort.artMode = !viewPort.artMode;
});

// viewPort.fieldOfView / 27

$('#up-button').on('click', () => {
	rotateViewPortUp(5);
});

$('#down-button').on('click', () => {
	rotateViewPortDown(5);
});

$('#left-button').on('click', () => {
	rotateViewPortLeft(5);
});

$('#right-button').on('click', () => {
	rotateViewPortRight(5);
});

$('#spinR-button').on('click', () => {
	spinViewPortRight(5);
});

$('#spinL-button').on('click', () => {
	spinViewPortLeft(5);
});

$('#jump-button').on('click', () => {
	jump(1000000);
});

$('#view-tilt-x').on('change', () => {
	viewPort.rotation.x = parseFloat($('#view-tilt-x').val());
	viewPort.render(celestialObjects);
});

$('#view-tilt-y').on('change', () => {
	viewPort.rotation.y = parseFloat($('#view-tilt-y').val());
	viewPort.render(celestialObjects);
});

$('#view-tilt-z').on('change', () => {
	viewPort.rotation.z = parseFloat($('#view-tilt-z').val());
	viewPort.render(celestialObjects);
});

$('#view-pos-x').on('change', () => {
	viewPort.position.x = parseFloat($('#view-pos-x').val());
	viewPort.render(celestialObjects);
});

$('#view-pos-y').on('change', () => {
	viewPort.position.y = parseFloat($('#view-pos-y').val());
	viewPort.render(celestialObjects);
});

$('#view-pos-z').on('change', () => {
	viewPort.position.z = parseFloat($('#view-pos-z').val());
	viewPort.render(celestialObjects);
});


function rotateViewPortUp(angle) {
	viewPort.rotation.z = (viewPort.rotation.z + angle) % 360;
	viewPort.render(celestialObjects);
}

function rotateViewPortDown(angle) {
	viewPort.rotation.z = (viewPort.rotation.z - angle) % 360;
	viewPort.render(celestialObjects);
}

function rotateViewPortRight(angle) {
	viewPort.rotation.y = (viewPort.rotation.y + angle) % 360;
	viewPort.render(celestialObjects);
}

function rotateViewPortLeft(angle) {
	viewPort.rotation.y = (viewPort.rotation.y - angle) % 360;
	viewPort.render(celestialObjects);
}

function spinViewPortRight(angle) {
	viewPort.rotation.x = (viewPort.rotation.x - angle) % 360;
	viewPort.render(celestialObjects);
}

function spinViewPortLeft(angle) {
	viewPort.rotation.x = (viewPort.rotation.x + angle) % 360;
	viewPort.render(celestialObjects);
}

function jump(distance) {
	start = viewPort.position;
	target = getOrbitalPoint(start, distance, viewPort.rotation.y, viewPort.rotation.z);
	viewPort.position = target;
	viewPort.render(celestialObjects);
}
