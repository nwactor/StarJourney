function startTime(timeElapsed) {
	function updateSpace() {
		var secondsElasped = timeElapsed / 1000;
		celestialObjects.forEach(entity => {
			entity.velocity.x += entity.acceleration.x / secondsElasped;
			entity.velocity.y += entity.acceleration.y / secondsElasped;
			entity.velocity.z += entity.acceleration.z / secondsElasped;

			entity.position.x += entity.velocity.x / secondsElasped;
			entity.position.y += entity.velocity.y / secondsElasped;
			entity.position.z += entity.velocity.z / secondsElasped;
		});
		viewPort.render(celestialObjects);
	}
	setInterval(updateSpace, timeElapsed);
}