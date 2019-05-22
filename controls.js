$('#art-button').on('click', () => {
	viewPort.artMode = !viewPort.artMode;
});

$('input').on('keydown', e => {
	e.stopPropagation();
});

var rotationKeySpeed = 5;

$(document).on('keydown', e => {
	switch(e.which) {
		case 38: //up
			rotateViewPortUp(rotationKeySpeed);
			break;
		case 40: //down
			rotateViewPortDown(rotationKeySpeed);
			break;
		case 37: //left
			rotateViewPortLeft(rotationKeySpeed);
			break;
		case 39: //right
			rotateViewPortRight(rotationKeySpeed);
			break;
		case 32: //space
			jump($('#jump-distance').val());
			break;
	}
});

var rotationClickSpeed = 15;

$('#up-button').on('click', () => {
	rotateViewPortUp(rotationClickSpeed);
});

$('#down-button').on('click', () => {
	rotateViewPortDown(rotationClickSpeed);
});

$('#left-button').on('click', () => {
	rotateViewPortLeft(rotationClickSpeed);
});

$('#right-button').on('click', () => {
	rotateViewPortRight(rotationClickSpeed);
});

$('#spinR-button').on('click', () => {
	spinViewPortRight(rotationClickSpeed);
});

$('#spinL-button').on('click', () => {
	spinViewPortLeft(rotationClickSpeed);
});

$('#jump-button').on('click', () => {
	jump($('#jump-distance').val());
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
	// var rotationLineLength = Math.sqrt(Math.pow(90, 2) + Math.pow(viewPort.rotation.z, 2));
	// var rotationLength = rotationLineLength / (90 / angle);
	// var angleOne = Math.asin(degreesToRadians(90 / rotationLength));
	// var angleTwo = Math.asin(degreesToRadians(viewPort.rotation.z / rotationLength));

	// viewPort.rotation.y = (rotationLength * angleOne) % 360;
	// viewPort.rotation.z = (rotationLength * angleTwo) % 360;
	// // viewPort.rotation.z = 
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