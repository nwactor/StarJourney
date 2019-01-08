class Rotation {
	constructor(x, y, z) { //in degrees
		this.x = x % 360;
		this.y = y % 360;
		this.z = z % 360;
	}
}

// module.exports = Rotation;