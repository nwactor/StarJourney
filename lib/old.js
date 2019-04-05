//Trying to get the axis going straight from cartesian -> spherical coord, instead of cartesian -> spherical -> cartesian -> spherical
getCoordRelativeToCOV(object, centerOfView) {
	var objSphericalCoord = this.getSphericalCoordinateFromPosition(object.position);
	var normalizedPosition = this.getNormalizedPosition(object.position);
	var angleDiffs = this.getAngleDiffs(centerOfView, objSphericalCoord);
	var oppositeHemispheres = this.areCoordsInOppositeHemispheres(centerOfView, objSphericalCoord);

	//variable names don't do justice to the following... it really needs a diagram to make sense

	//Lesser part of the "support" triangle
	var partialObjVerticalDistance_1 = normalizedPosition.x * Math.tan(degreesToRadians(centerOfView.vAngle)); // T
	var partialObjVerticalDistance_2 = normalizedPosition.z - partialObjVerticalDistance_1; // P
	var lesserSupportHypotenuse; // K
	if(centerOfView.vAngle % 180 == 0) {
		lesserSupportHypotenuse = normalizedPosition.x;
	} else {
		lesserSupportHypotenuse = normalizedPosition.x / Math.sin(degreesToRadians(centerOfView.vAngle)); // K
	}

	//Successor to the Mystery Triangle
	var covAngleRemainder = 90 - centerOfView.vAngle; // x
	var ZPOS = partialObjVerticalDistance_2 * Math.sin(degreesToRadians(covAngleRemainder)); // Z
	var lowerMysterySide = partialObjVerticalDistance_2 * Math.cos(degreesToRadians(covAngleRemainder)); // N

	//the object's new distance triangle for the new coords
	var relativeVAngle = radiansToDegrees(Math.asin(ZPOS / 1)); // nva
	var objRelativeHorizontalDistance = Math.cos(degreesToRadians(relativeVAngle)); // W

	//Greater Support Triangle
	var greaterSupportHypotenuse = lesserSupportHypotenuse + lowerMysterySide; // J
	var inflectionPointHeight = greaterSupportHypotenuse * Math.sin(degreesToRadians(centerOfView.vAngle)); // L
	var greaterSupportHorizontalDistance = greaterSupportHypotenuse * Math.cos(degreesToRadians(centerOfView.vAngle)); // M
	var partialGreaterSupportHorizontalDistance = greaterSupportHorizontalDistance - normalizedPosition.x; // H

	//Inflection Point Distance Triangle (underneath the object's new distance triangle)
	var inflectionVAngle = radiansToDegrees(Math.asin(inflectionPointHeight / objRelativeHorizontalDistance)); // u
	var inflectionHorizontalDistance = objRelativeHorizontalDistance * Math.cos(degreesToRadians(inflectionVAngle)); // A

	//triangle between base of inflection triangle and base of support triangle
	var partialHdifference_1 = radiansToDegrees(Math.atan(partialGreaterSupportHorizontalDistance / inflectionHorizontalDistance));

	//new hdiff base triangle
	var partialHdifference_2 = angleDiffs.hDiffFromCenter - partialHdifference_1; // e
	var Q = inflectionHorizontalDistance * Math.cos(degreesToRadians(partialHdifference_2)); // Q
	
	//new hdiff triangle
	var XPOS = Q / Math.cos(degreesToRadians(centerOfView.vAngle)); // R
	var relativeHAngle = radiansToDegrees(Math.acos(XPOS / objRelativeHorizontalDistance));

	var relativeCoordinate = new SphericalCoordinate(objSphericalCoord.origin, objSphericalCoord.distance, relativeHAngle, relativeVAngle);
	return relativeCoordinate;
}
//Trying to find the relative position using a linear transformation
getPositionRelativeToCOV(object, centerOfView) {
		//get the relative position of the object with relation to the normal axis
		let objRelPos = new Position(object.position.x - this.position.x, object.position.y - this.position.y, object.position.z - this.position.z);
		
		//get the relative position using the CoV as the x-axis
		//the object's transform is the CoV's transform in reverse
		let iHat = this.getPositionFromSphericalCoord(new SphericalCoordinate(centerOfView.origin, 1, 0 - centerOfView.hAngle, (0 - centerOfView.vAngle) * Math.cos(degreesToRadians(centerOfView.hAngle - 0))));
		let jHat = this.getPositionFromSphericalCoord(new SphericalCoordinate(centerOfView.origin, 1, 90 - centerOfView.hAngle, (0 - centerOfView.vAngle) * Math.cos(degreesToRadians(centerOfView.hAngle - 90))));
		let kHat = this.getPositionFromSphericalCoord(new SphericalCoordinate(centerOfView.origin, 1, 0, 90 - centerOfView.vAngle));// 0 - (this.rotation.x * -1) add in x-rotation

		if(object.name == "back") {
			console.log(iHat);
			console.log(jHat);
			console.log(kHat);
		}

		//Apply the transform with some matrix multiplication
		let newX = (objRelPos.x * (iHat.x - centerOfView.origin.x)) + (objRelPos.y * (jHat.x - centerOfView.origin.x)) + (objRelPos.z * (kHat.x - centerOfView.origin.x));
		let newY = (objRelPos.x * (iHat.y - centerOfView.origin.y)) + (objRelPos.y * (jHat.y - centerOfView.origin.y)) + (objRelPos.z * (kHat.y - centerOfView.origin.y));
		let newZ = (objRelPos.x * (iHat.z - centerOfView.origin.z)) + (objRelPos.y * (jHat.z - centerOfView.origin.z)) + (objRelPos.z * (kHat.z - centerOfView.origin.z));

		let adjustedPosition = new Position(newX, newY, newZ);
		if(object.name == 'back') {
			console.log(adjustedPosition);
		}
		return adjustedPosition;
	}
//This was trying to find the correct coordinates with trig, rather than linear transformations and converting the
//axis to be relative to the center of views
get2DPositionCoordinatesOLD(object, centerOfView) {
	//every coordinate can be flipped to produce the same point on the celestial sphere.
	//here, we get both sets of coordinates, so we can use the one whose numbers are closer
	//to the center of view
	let objSphericalCoord = this.getSphericalCoordinateFromPosition(object.position);
	let flippedSphericalCoord = this.getFlippedSphericalCoord(objSphericalCoord);
	
	//find whether it is better to use positive or negative angles for each set of coordinates
	let normalReferences = this.findBestAngleReferences(centerOfView, objSphericalCoord);
	let flippedReferences = this.findBestAngleReferences(centerOfView, flippedSphericalCoord);

	let normalDistance = this.getDiagonalDistance(normalReferences.h - centerOfView.hAngle, normalReferences.v - centerOfView.vAngle);
	let flippedDistance = this.getDiagonalDistance(flippedReferences.h - centerOfView.hAngle, flippedReferences.v - centerOfView.vAngle);
	
	let hAngleReference;
	let vAngleReference;
	
	//compare find which set of coordinates is better for the center of view
	if(normalDistance < flippedDistance) {
		hAngleReference = normalReferences.h;
		vAngleReference = normalReferences.v;
	} else {
		hAngleReference = flippedReferences.h;
		vAngleReference = flippedReferences.v;
	}

	

	//get the raw angular distance of the object from the center of view
	let hDiffFromCenter = hAngleReference - centerOfView.hAngle;
	let vDiffFromCenter = vAngleReference - centerOfView.vAngle;

	let objectIsVisible = true;
	if(!(Math.abs(hDiffFromCenter) <= this.fieldOfView / 2 && Math.abs(vDiffFromCenter) <= this.fieldOfView / 2)) {
		// return {isVisible: false};
		objectIsVisible = false;
	}

	let horizontalDist = Math.cos(degreesToRadians(vDiffFromCenter)) * Math.sin(degreesToRadians(hDiffFromCenter));
	let verticalDist = Math.sin(degreesToRadians(vDiffFromCenter));

	// horizontalDist = Math.sin(degreesToRadians(vDiffFromCenter)) * Math.sin(degreesToRadians(hDiffFromCenter));
	// verticalDist = Math.sin(degreesToRadians(vDiffFromCenter)) * Math.cos(degreesToRadians(hDiffFromCenter));	
	
	// horizontalDist = Math.cos(degreesToRadians(vAngleReference)) * Math.sin(degreesToRadians(hDiffFromCenter)) * Math.cos(degreesToRadians(vDiffFromCenter)); 
	// verticalDist = (Math.abs(Math.sin(degreesToRadians(vAngleReference))) * Math.sin(degreesToRadians(vDiffFromCenter))) + (Math.sin(degreesToRadians(vDiffFromCenter)) * Math.cos(degreesToRadians(hDiffFromCenter)) * Math.cos(degreesToRadians(vAngleReference)));

	if(object.name == "h0vn45") {
		// console.log(centerOfView.hAngle);
		// console.log(objSphericalCoord);
		// console.log(normalReferences);
		console.log("ha: " + hAngleReference);
		// console.log("measured h: " + radiansToDegrees(Math.asin(hDiffFromCenter / poleDistance_2D)));
		console.log("va: " + vAngleReference);
		console.log("hDif: " + hDiffFromCenter);
		console.log("vDif: " + vDiffFromCenter);
		// console.log("pole dist 2: " + poleDistance_2D);
		// console.log("pole dist 3: " + poleDistance_3D);
		console.log("h: " + horizontalDist);
		console.log("v: " + verticalDist);
	}

	let u = (horizontalDist /*/ (this.fieldOfView / 2)*/) * 100;
	let v = (verticalDist /*/ (this.fieldOfView / 2)*/) * 100;

	//do a linear transfrom to determine the position after x rotation is taken into account
	//the transform matrix:
	let transform = [
		[Math.cos(degreesToRadians(this.rotation.x)), Math.sin(degreesToRadians(this.rotation.x))], //iHat
		[-1 * Math.sin(degreesToRadians(this.rotation.x)), Math.cos(degreesToRadians(this.rotation.x))] //jHat
	];

	//apply transform to u and v via matrix multiplication
	let rotatedU = (u * transform[0][0]) + (v * transform[1][0]);
	let rotatedV = (u * transform[0][1]) + (v * transform[1][1]);

	return {x: rotatedU, y: rotatedV, isVisible: objectIsVisible};
}


// OLD WAYS OF TRYING TO FIND COORDINATES:
////////////////////////////////////
//the way that "worked"

let horizontalDist = hDiffFromCenter * Math.cos(degreesToRadians(vAngleReference));
let verticalDist = vDiffFromCenter;


////////////////////////////////////

//one try
let distances = this.convertAnglesToCartesian(hDiffFromCenter, vDiffFromCenter);
let horizontalDist = distances.horizontalDist + (hDiffFromCenter * Math.cos(degreesToRadians(this.rotation.z)));		// let verticalDist = distances.verticalDist;
let verticalDist = distances.verticalDist;


////////////////////////////////////
//using pole distance

//get the actual angular distance between the object and the nearest pole
let poleDistance_3D = this.getDistanceToNearestPole(vAngleReference);

//get the 2d-diagonal angular distance between the object and the nearest pole
let poleDistance_2D;
if(poleDistance_3D == 90) {
		poleDistance_2D = 90;
	} else {
		poleDistance_2D = hDiffFromCenter / Math.sin(degreesToRadians(hAngleReference));
	}
	if(isNaN(poleDistance_2D) || Math.sin(degreesToRadians(hAngleReference)) == 0) { //this means the object's hAngle is 0 or 180
		poleDistance_2D = this.getDistanceToNearestPole(vAngleReference);
	}		

let horizontalDist;
if(hDiffFromCenter < 0) {
	horizontalDist = hDiffFromCenter + Math.cos(degreesToRadians(hAngleReference)) * (poleDistance_2D - poleDistance_3D);
} else {
	horizontalDist = hDiffFromCenter - Math.cos(degreesToRadians(hAngleReference)) * (poleDistance_2D - poleDistance_3D);
}

let verticalDist;
if(verticalDist < 0) {
	verticalDist = vDiffFromCenter + Math.sin(degreesToRadians(hAngleReference)) * (poleDistance_2D - poleDistance_3D);
} else {
	verticalDist = vDiffFromCenter - Math.sin(degreesToRadians(hAngleReference)) * (poleDistance_2D - poleDistance_3D);
}
////////////////////////////////////

checkForSingleAngleRotation(centerH, centerV, objectH, objectV) {
	let hOpposition = this.checkIfAnglesOppose(centerH, objectH);
	let vOpposition = this.checkIfAnglesOppose(centerV, objectV);
	if(!(hOpposition && vOpposition)) { //not both opposed
		if(hOpposition || vOpposition) { //only one opposed
			return true;
		}
	}
	return false;
}
checkIfAnglesOppose(angleA, angleB) { //returns false if both angles are in the same hemisphere
	if(angleA < 0 ) {
		angleA = getEquivalentAngle(angleA);
	}
	if(angleB < 0) {
		angleB = getEquivalentAngle(angleB);
	}
	// console.log("h " + angleA);
	// console.log("v " + angleB);
	//check "front" hemisphere: 270 to 90
	if(angleA >= 270 || angleA < 90) {
		if(!(angleB >= 270 || angleB < 90)) {
			return true;
		} else {
			return false;
		}
	}
	//check "back" hemisphere: 90 to 270
	if(angleA >= 90 && angleA < 270) {
		if(!(angleB >= 90 && angleB < 270)) {
			return true;
		} else {
			return false;
		}
	}
	//should be unreachable
	console.log("checkIfAnglesOppose function is broken");
}
checkEquivalentRotations(rotatedAngle, nonRotatedAngle, targetAngle, range, nonRotatedReference, result) {
	if(rotatedAngle + range > 90 || rotatedAngle - 90 < -90) {
		//add 180 to the angle of the center of view that wasn't rotated.
		//flippedAnlge is essentially the rotation of nonRotatedAngle.
		let flippedAngle;
		if(nonRotatedAngle >= 0) {
			flippedAngle = (nonRotatedAngle + 180) % 360;
		} else {
			flippedAngle = (getEquivalentAngle(nonRotatedAngle) + 180) % 360;
		}

		//get the better reference angle (positive or negative) for the target angle compared to the newly flipped angle
		let flippedAngleReference;
		if(Math.abs(targetAngle - flippedAngle) < Math.abs(getEquivalentAngle(targetAngle) - flippedAngle)) {
			flippedAngleReference = targetAngle;
		} else {
			flippedAngleReference = getEquivalentAngle(targetAngle);
		}

		//if the flipped angle is closer to the object than the non-flipped version, return it. 
		let flippedDistance = flippedAngleReference - flippedAngle;
		let regDistance = nonRotatedReference - nonRotatedAngle;
		if(Math.abs(flippedDistance) < Math.abs(regDistance)) {
			result = flippedDistance * -1; //looking "upside down" flips the image
		}
	}
	return result;
}
checkCelestialPoleInView(vAngle) {
	var poleInView = false;
	var upperBound = (vAngle + (this.fieldOfView / 2));
	var lowerBound = (vAngle - (this.fieldOfView / 2));
	
	if(lowerBound > upperBound) {
		lowerBound = getEquivalentAngle(lowerBound);
		//if it's still lower, it should have been the other way around
		if(lowerBound > upperBound) {
			lowerBound = getEquivalentAngle(lowerBound);
			upperBound = getEquivalentAngle(upperBound);
		}
	}

	//the poles are 90/-270 and -90/270

	if(vAngle > 0) {
		if(upperBound > 90 && lowerBound < 90) {
			poleInView = true;
		} else if(upperBound > 270 && lowerBound < 270) {
			poleInView = true;
		}
	} else {
		if(lowerBound < -90 && upperBound > -90) {
			poleInView = true;
		} else if(lowerBound < -270 && upperBound > -270) {
			poleInView = true;
		}
	}

	return poleInView;
}
getNormalizedPosition(object) {
	let relativePosition = new Position(object.position.x - this.position.x, object.position.y - this.position.y, object.position.z - this.position.z);

	//normalize star's position to get a point on the unit sphere
	let radius = new Position(0, 0, 0).getDistance(relativePosition);

	let normalizeRatio = 1 / radius;
	let normalizedPosition = new Position(relativePosition.x * normalizeRatio, relativePosition.y * normalizeRatio, relativePosition.z * normalizeRatio);

	return normalizedPosition;
}


//Rectangular Viewport Methods

checkRectangleLineOfSight(object) {
	//get point at center of field of view on sphere
	let centerOfView = this.getViewCenter();	

	//get star's spherical coordinate relative to the viewport
	let objSphericalCoord = this.getSphericalCoordinateFromPosition(object.position);	

	//get the horizontal and vertical ranges of the viewport's cone on the unit sphere
	//viewport field of view controls the amount of the sphere surface that is visible
	let hUpperRange = (centerOfView.hAngle + (this.fieldOfView / 2)) % 360;
	let hLowerRange = (centerOfView.hAngle - (this.fieldOfView / 2)) % 360;
	let vUpperRange = (centerOfView.vAngle + (this.fieldOfView / 2)) % 360;
	let vLowerRange = (centerOfView.vAngle - (this.fieldOfView / 2)) % 360;

	//check that point fits inside of h range and v range
	let isObjectVisible = this.checkWithinRectangleRange(objSphericalCoord.hAngle, hLowerRange, hUpperRange) && 
		this.checkWithinRectangleRange(objSphericalCoord.vAngle, vLowerRange, vUpperRange);

	return isObjectVisible;
}
checkWithinRectangleRange(angle, lowerBound, upperBound) {
	if(lowerBound > upperBound) {
		lowerBound = getEquivalentAngle(lowerBound);
		//if it's still lower, it should have been the other way around
		if(lowerBound > upperBound) {
			lowerBound = getEquivalentAngle(lowerBound);
			upperBound = getEquivalentAngle(upperBound);
		}
	}
	return (angle >= lowerBound && angle <= upperBound) ||
	(getEquivalentAngle(angle) >= lowerBound && getEquivalentAngle(angle) <= upperBound);
}