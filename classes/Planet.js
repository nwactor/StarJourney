class Planet extends CelestialObject {
	constructor(name, color, radius, position, altNames) {
		super(name, color, radius, position, altNames);
	}
	showInfo(viewport) {
		$('#star-info').css('display', 'none');
		super.showInfo(viewport);
	}
}