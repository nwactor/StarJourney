class Planet extends CelestialObject {
	constructor(name, color, radius, position, altNames, image) {
		super(name, color, radius, position, altNames);
		this.image = image;
	}
	showInfo(viewport) {
		$('#star-info').css('display', 'none');
		super.showInfo(viewport);
	}
}