getPositionFromSphericalCoord(sCoord) {
	let zPos = sCoord.origin.z + Math.sin(degreesToRadians(sCoord.vAngle)) * sCoord.distance;

	let hDistance = Math.cos(degreesToRadians(sCoord.vAngle)) * sCoord.distance;
	let xPos = sCoord.origin.x + Math.cos(degreesToRadians(sCoord.hAngle)) * hDistance;
	let yPos = sCoord.origin.y + Math.sin(degreesToRadians(sCoord.hAngle)) * hDistance;	

	return new Position(xPos, yPos, zPos);
}
getDifferenceBetweenAngles(anchor, other) {
	return Math.abs(anchor - this.getBestAngleReference(anchor, other));
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