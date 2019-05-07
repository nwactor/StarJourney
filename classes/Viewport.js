class ViewPort {
	//a circular viewport
	constructor(position, rotation, fieldOfView) {
		this.position = position;
		this.rotation = rotation; //has x, y, z properties, in degrees
		this.fieldOfView = fieldOfView; //should be width of angle in degrees, by default 180?
		// this.angle = angle; //has vertical and horizontal properties; should usually have the same ratio as height and width
		//u and v are screen space coordinates
		// this.uRange = this.fieldOfView / 2;
		// this.vRange = this.fieldOfView / 2;
		this.artMode = false;
	}
	render(celestialObjects) {
		celestialObjects.sort((a, b) => {
			return this.position.getDistance(b.position) - this.position.getDistance(a.position);
		});

		//clear the viewewport unless artMode is on
		if(!this.artMode) {$('#viewport').empty();}

		var centerOfView = this.getViewCenter();
		//adjust center of view if it is too close to 360 or -360
		//tries to avoid the problem instead of solving it
		if(360 - centerOfView.hAngle < this.fieldOfView / 2 || Math.abs(-360 - centerOfView.hAngle) < this.fieldOfView / 2) {
			centerOfView.hAngle = getEquivalentAngle(centerOfView.hAngle);
		}
		if(360 - centerOfView.vAngle < this.fieldOfView / 2 || Math.abs(-360 - centerOfView.vAngle) < this.fieldOfView / 2) {
			centerOfView.vAngle = getEquivalentAngle(centerOfView.vAngle);
		}

		celestialObjects.forEach(function(object) {
			let coordinates = this.get2DPositionCoordinates(object, centerOfView);
			

			if(coordinates.isVisible) {
				//put it on the viewport in the place it would fall on the sphere
				object.displayOnViewport(this, coordinates);
			}
		}.bind(this));

		$('#view-tilt-x').val(this.rotation.x);
		$('#view-tilt-y').val(this.rotation.y);
		$('#view-tilt-z').val(this.rotation.z);
		$('#view-pos-x').val(this.position.x);
		$('#view-pos-y').val(this.position.y);
		$('#view-pos-z').val(this.position.z);
	}
	get2DPositionCoordinates(object, centerOfView) {
		//get the object's spherical coordinates using the center of view as the axis
		let obj3dCoord = this.getPositionRelativeToCOV(object, centerOfView);
		let objSphericalCoord = this.getSphericalCoordinateFromRelativePosition(obj3dCoord);

		centerOfView = new SphericalCoordinate(this.position, 1, 0, 0);
		
		let angleDiffs = this.getAngleDiffs(centerOfView, objSphericalCoord);
		let hDiffFromCenter = angleDiffs.hDiffFromCenter;
		let vDiffFromCenter = angleDiffs.vDiffFromCenter;

		let isObjectVisible;
		if(!(Math.abs(hDiffFromCenter) <= this.fieldOfView / 2 && Math.abs(vDiffFromCenter) <= this.fieldOfView / 2)) {
			return {isVisible: false};
		} else {
			isObjectVisible = true;
		}

		let horizontalDist = Math.cos(degreesToRadians(vDiffFromCenter)) * Math.sin(degreesToRadians(hDiffFromCenter));
		let verticalDist = Math.sin(degreesToRadians(vDiffFromCenter));

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

		return {x: rotatedU, y: rotatedV, isVisible: isObjectVisible};
	}
	getPositionRelativeToCOV(object, centerOfView) {
		if(object.name == "Neptune") {
			console.log();
		}
		var objSphericalCoord = this.getSphericalCoordinateFromPosition(object.position);
		var angleDiffs = this.getAngleDiffs(centerOfView, objSphericalCoord);
		var oppositeHemispheres = this.areCoordsInOppositeHemispheres(centerOfView, objSphericalCoord);

		//variable names don't do justice to the following... it really needs a diagram to make sense

		//Right side Triangle
		var objHorizontalDistance = Math.cos(degreesToRadians(objSphericalCoord.vAngle)) / 1; // A
		var objVerticalDistance = Math.sin(degreesToRadians(objSphericalCoord.vAngle)) / 1; // C

		//Bottom Triangle
		var covPartialHorizontalDistance = objHorizontalDistance * Math.cos(degreesToRadians(angleDiffs.hDiffFromCenter)); // B
		if(isCosZero(angleDiffs.hDiffFromCenter)) { covPartialHorizontalDistance = 0; } //account for rounding errors
		var YPOS = objHorizontalDistance * Math.sin(degreesToRadians(angleDiffs.hDiffFromCenter)); // D, or the distance from the cov's X-Plane
		if(isSinZero(angleDiffs.hDiffFromCenter)) { YPOS = 0; } //acount for rounding errors

		//Left side Triangle
		var leftSideAngle = radiansToDegrees(Math.atan(objVerticalDistance / covPartialHorizontalDistance)); // x
		if(covPartialHorizontalDistance == 0) { leftSideAngle = 90; } //account for divide by 0 error
		var leftSideDistance; // E
		if(isSinZero(leftSideAngle)) { //account for divide by 0 error
			leftSideDistance = covPartialHorizontalDistance;
		} else {
			leftSideDistance = objVerticalDistance / Math.sin(degreesToRadians(leftSideAngle));
		}

		//important triangle
		var covVerticalAngleDiff; // y
		if(this.isSphericalCoordBehindCoV(centerOfView, objSphericalCoord)) {
			YPOS *= -1;
			if(Math.abs(angleDiffs.vDiffFromCenter) > 90) {
				covVerticalAngleDiff = leftSideAngle - centerOfView.vAngle;
			} else {
				covVerticalAngleDiff = (90 - leftSideAngle) + (90 - centerOfView.vAngle);
			}
		} else {
			covVerticalAngleDiff = leftSideAngle - centerOfView.vAngle;
		}
		var ZPOS = leftSideDistance * Math.sin(degreesToRadians(covVerticalAngleDiff));
		if(isSinZero(covVerticalAngleDiff)) { ZPOS = 0; } //account for rounding errors
		var XPOS = leftSideDistance * Math.cos(degreesToRadians(covVerticalAngleDiff));
		if(isCosZero(covVerticalAngleDiff)) { XPOS = 0; } //account for rounding errors

		
		if(object.name == "Neptune") {
			console.log();
		}

		//determine the sign of the positions
		if(oppositeHemispheres) {
			if(XPOS > 0) {XPOS *= -1;}
		}
		if(Math.abs(centerOfView.vAngle) >= 90 && (angleDiffs.hDiffFromCenter % 270 == 0 && angleDiffs.hDiffFromCenter != 0 || Math.abs(angleDiffs.hDiffFromCenter) == 90)) {
			YPOS *= -1;
		}
		
		var relativePosition = new Position(XPOS, YPOS, ZPOS);
		return relativePosition;
	}
	getViewCenter() {
		return new SphericalCoordinate(this.position, 1, this.rotation.y, this.rotation.z);
	}
	//get the spherical coordinates of a position using the origin as the origin
	//(this is useful when the position given is already relative)
	getSphericalCoordinateFromRelativePosition(position) {
		let origin = new Position(0,0,0);

		let distance = origin.getDistance(position);
		let hDistance = this.getDiagonalDistance(position.y, position.x);

		let sinHAngle = position.y / hDistance; //opposite / hypotenuse
		if(hDistance == 0) { sinHAngle = 0; }
		let hAngle = radiansToDegrees(Math.asin(sinHAngle));
		if(Math.abs(parseFloat(hAngle.toFixed()) - hAngle) < 0.00000000000001) {
			hAngle = parseFloat(hAngle.toFixed());
		}

		let sinVAngle = position.z / distance; //opposite / hypotenuse
		if(distance == 0) { sinVAngle = 0; }
		let vAngle = radiansToDegrees(Math.asin(sinVAngle));
		if(Math.abs(parseFloat(vAngle.toFixed()) - vAngle) < 0.00000000000001) {
			vAngle = parseFloat(vAngle.toFixed());
		}

		//displays things with a negative x value correctly (goes halfway around)
		if(position.x < origin.x) {
			if(hAngle > 0) {
				hAngle = 90 + (90 - hAngle);
			} else {
				hAngle = -90 + (-90 - hAngle);
			}
		}

		return new SphericalCoordinate(new Position(0,0,0), distance, hAngle, vAngle);
	}
	//Get the spherical coordinates of a 3d position using the viewport as the origin
	getSphericalCoordinateFromPosition(position) {
		let relativePosition = this.getRelativePosition(position);
		let origin = new Position(0,0,0);

		let distance = origin.getDistance(relativePosition);
		let hDistance = this.getDiagonalDistance(relativePosition.y, relativePosition.x);

		let sinHAngle = relativePosition.y / hDistance; //opposite / hypotenuse
		if(hDistance == 0) { sinHAngle = 0; }
		let hAngle = radiansToDegrees(Math.asin(sinHAngle));
		if(Math.abs(parseFloat(hAngle.toFixed()) - hAngle) < 0.00000000000001) {
			hAngle = parseFloat(hAngle.toFixed());
		}

		let sinVAngle = relativePosition.z / distance; //opposite / hypotenuse
		if(distance == 0) { sinVAngle = 0; }
		let vAngle = radiansToDegrees(Math.asin(sinVAngle));
		if(Math.abs(parseFloat(vAngle.toFixed()) - vAngle) < 0.00000000000001) {
			vAngle = parseFloat(vAngle.toFixed());
		}

		//displays things with a negative x value correctly (goes halfway around)
		if(relativePosition.x < origin.x) {
			if(hAngle > 0) {
				hAngle = 90 + (90 - hAngle);
			} else {
				hAngle = -90 + (-90 - hAngle);
			}
		}

		return new SphericalCoordinate(new Position(0,0,0), distance, hAngle, vAngle);
	}
	getAngleDiffs(centerOfView, objSphericalCoord) {
		//every set of H/Vangles can be "flipped" to produce the same point on the celestial sphere.
		//here, we get the flipped set of coordinates, so we can use the one whose numbers are closer
		//to the center of view.
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

		return {
			"hDiffFromCenter": hDiffFromCenter,
			"vDiffFromCenter": vDiffFromCenter,
			"hAngleReference": hAngleReference,
			"vAngleReference": vAngleReference
		};
	} 
	getFlippedSphericalCoord(sCoord) {
		return new SphericalCoordinate(sCoord.origin, sCoord.distance, 
			(sCoord.hAngle + 180) % 360,
			(180 - sCoord.vAngle) % 360);
	}
	getPositionFromSphericalCoord(sCoord) {
		let zPos = sCoord.origin.z + Math.sin(degreesToRadians(sCoord.vAngle)) * sCoord.distance;
	
		let hDistance = Math.cos(degreesToRadians(sCoord.vAngle)) * sCoord.distance;
		let xPos = sCoord.origin.x + Math.cos(degreesToRadians(sCoord.hAngle)) * hDistance;
		let yPos = sCoord.origin.y + Math.sin(degreesToRadians(sCoord.hAngle)) * hDistance;	

		return new Position(xPos, yPos, zPos);
	}
	findBestAngleReferences(centerOfView, objSphericalCoord) {
		/* determine whether it is approriate to use the positive 
		or negative interpretations of the object's angles (for example -60 or 300).
		We want whichever ones are closest to the center of view.*/
		var bestReferences = {
			h: this.getBestAngleReference(centerOfView.hAngle, objSphericalCoord.hAngle),
			v: this.getBestAngleReference(centerOfView.vAngle, objSphericalCoord.vAngle)
		};

		return bestReferences;
	}
	getBestAngleReference(anchor, other) {
		//0 is a special case, because the equivalent angle could be 0, 360, or -360.
		//getEquivalentAngle(0) returns 360, so the -360 case still has to be checked here.
		if(other % 360 == 0) {
			return this.getBestAngleReferenceForZero(anchor);
		} else { //the usual case
			let equivalentAngleOther = getEquivalentAngle(other);
			
			let difference = Math.abs(other - anchor);
			let equivalentDifference = Math.abs(equivalentAngleOther - anchor);

			if(difference < equivalentDifference) {
				return other;
			} else {
				return equivalentAngleOther;
			}
		}
	}
	getBestAngleReferenceForZero(centerAngle) {
		let zeroDiff = Math.abs(0 - centerAngle);
		let negativeDiff = Math.abs(-360 - centerAngle);
		let positiveDiff = Math.abs(360 - centerAngle);

		if(zeroDiff < negativeDiff) {
			if(zeroDiff < positiveDiff) {
				return 0;
			} else {
				return 360;
			}
		} else {
			if(negativeDiff < positiveDiff) {
				return -360;
			} else {
				return 360;
			}
		}
	}
	getDifferenceBetweenAngles(anchor, other) {
		return Math.abs(anchor - this.getBestAngleReference(anchor, other));
	}
	areCoordsInOppositeHemispheres(coordA, coordB) {
		var angleDiffs = this.getAngleDiffs(coordA, coordB);
		if(Math.abs(angleDiffs.hDiffFromCenter) > 90) {
			return Math.abs(angleDiffs.vDiffFromCenter) < 90;
		} else {
			return Math.abs(angleDiffs.vDiffFromCenter) > 90;
		}
	}
	isSphericalCoordBehindCoV(centerOfView, sphericalCoord) {
		var neutralCov = new SphericalCoordinate(centerOfView.origin, centerOfView.distance, centerOfView.hAngle, 0);
		return this.areCoordsInOppositeHemispheres(neutralCov, sphericalCoord);
	}
	convertAnglesToCartesian(hDiff, vDiff) {
		if(hDiff < 0) {
			hDiff = (getEquivalentAngle(hDiff));
		}

		let distances = {};
		if(hDiff >= 0 && hDiff < 90) { //Quadrant 1
			distances.horizontalDist = vDiff * Math.sin(degreesToRadians(hDiff));
			distances.verticalDist = vDiff * Math.cos(degreesToRadians(hDiff));
		} else if(hDiff >= 90 && hDiff < 180) { //Quadrant 2
			distances.horizontalDist = vDiff * Math.cos(degreesToRadians(hDiff % 90)) * -1;
			distances.verticalDist = vDiff * Math.sin(degreesToRadians(hDiff % 90));
		} else if(hDiff >= 180 && hDiff < 270) { //Quadrant 3
			distances.horizontalDist = vDiff * Math.sin(degreesToRadians(hDiff % 180));
			distances.verticalDist = vDiff * Math.cos(degreesToRadians(hDiff % 180));
		} else if(hDiff >= 270 && hDiff <= 360) { //Quadrant 4
			distances.horizontalDist = vDiff * Math.cos(degreesToRadians(hDiff % 270)) * -1;
			distances.verticalDist = vDiff * Math.sin(degreesToRadians(hDiff % 270));
		}
		return distances;
	}
	getDiagonalDistance(a, b) {
		var cSquared = a**2 + b**2;
		return Math.abs(Math.sqrt(cSquared));
	}
	getRelativePosition(position) {
		return new Position(
			position.x - this.position.x,
			position.y - this.position.y,
			position.z - this.position.z
		);
	}
	getNormalizedPosition(position) {
		var relativePosition = this.getRelativePosition(position);
		var distance = this.position.getDistance(position);
		if (distance == 0) {
			return new Position(0,0,0);
		}
		return new Position(
			relativePosition.x / distance,
			relativePosition.y / distance,
			relativePosition.z / distance
		);
	}
}

// helper functions

function radiansToDegrees(radians) {
	return radians * (180 / Math.PI);
}

function degreesToRadians(degrees) {
	return degrees * (Math.PI / 180);
}