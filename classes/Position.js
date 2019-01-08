class Position {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	getDistance(other) {
		//deltas for x, y, and z coordinates
		var dX = this.x - other.x;
		var dY = this.y - other.y;
		var dZ = this.z - other.z;
		//calcuate distance
		var distance = Math.sqrt(dX**2 + dY**2 + dZ**2);
		return distance;
	}
}

// module.exports = Position;