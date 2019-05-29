class CelestialObject {
	constructor(name, color, radius, position, altNames) {
		this.name = name;
		this.color = color;
		this.radius = radius;
		this.position = position;
		this.altNames = altNames;
	}
	displayOnViewport(viewport, coordinates) {
		var appearance = $('<div>');
		appearance.attr("id", this.name);
		appearance.addClass("celestialObject");

		var top = 50 - (coordinates.y * 50);
		var left = 50 + (coordinates.x * 50);
		appearance[0].style.top = top + "%";
		appearance[0].style.left = left + "%";

		//show a circle with diameter = (apparentAngle / viewport.FoV) * height 
		appearance.css("background-color", this.color);

		var diameter = (this.getApparentSize(viewport.position).degrees) / (viewport.fieldOfView);
		diameter *= (window.innerHeight * .95);

		//visibility protection for when the object is smaller than one pixel
		if(diameter < 2 && diameter > .0000001) {
			diameter = 2;
		}

		//add a background image if one is available and the object is big enough for detail
		if(this.image && diameter >= 2) {
			appearance.css('background-image', this.image);
		}

		appearance.height(diameter);
		appearance.width(diameter);

		//center the object on its location rather than having location correspond to the top left corner
		appearance[0].style["-webkit-transform"] = "translate(-50%, -50%)";

		let frame = $('<div>');
		frame.addClass("frame");

		var frameSizeMultiplier;
		if(diameter < 10) {
			frameSizeMultiplier = 3;
		} else {
			frameSizeMultiplier = 1.5;
		}
		
		frame.height(diameter * frameSizeMultiplier);
		frame.width(diameter * frameSizeMultiplier);
		if(frame.height % 2 == 1) {
			frame.height(frame.height() + 1);
			frame.width(frame.width() + 1);
		}

		let frameLabel = $('<span>');
		frameLabel.text(this.name);
		frameLabel[0].style.top = -1 * frameLabel.height();
		frameLabel.addClass("frameLabel");

		frame.append(frameLabel);
		$(appearance).append(frame);

		//make object show its name when hovered over
		appearance.on('mouseover', () => {
			if(appearance.height() <= 2) {
				appearance.height(appearance.height() + 2);
				appearance.width(appearance.width() + 2);
			}
			frame.css('display', 'inline');			
		});

		//remove name when no longer hovered over
		appearance.on('mouseout', e => {
			frame.css('display', 'none');	
			if(appearance.height() <= 4) {
				appearance.height(appearance.height() - 2);
				appearance.width(appearance.width() - 2);
			}
		});

		//add a click handler to make the viewport look at the object
		appearance.on('click', e => {
			viewport.lookAt(this);
			this.showInfo(viewport);
		});

		$('#viewport').append(appearance);
	}
	//1 degree = 60 arc minutes
	//1 arc minute = 60 arc seconds
	//https://en.wikipedia.org/wiki/Angular_diameter
	getApparentSize(perspective) {
		var distance = perspective.getDistance(this.position);
		var diameter = this.radius * 2;

		var apparentDiameter; //in radians
		if(diameter / distance < .001) {
			//good enough approximation
			apparentDiameter = diameter / distance; 
		} else {
			apparentDiameter = 2 * Math.atan(diameter / (2 * distance));
		}

		//convert to degrees
		apparentDiameter *= (180 / Math.PI);

		//convert to arcminutes
		var arcminutes = apparentDiameter * 60;

		//get the remaining arcseconds
		var arcseconds = (arcminutes % 1) * 60;

		//get a pretty arc measurement
		var arc;
		if(Math.floor(arcminutes) > 0) {
			arc = `${Math.floor(arcminutes)}'${Math.round(arcseconds * 100) / 100}"`;
		} else {
			arc = `${Math.round(arcseconds * 100) / 100}"`
		}

		//return object
		var apparentSize = {
			degrees: apparentDiameter,
			arc: arc
		}

		return apparentSize;
	}
	showInfo(viewport) {
		$('#selected-name').text(this.name);
		var distance = viewport.position.getDistance(this.position);
		$('#selected-distance-miles').text(distance);
		$('#selected-distance-au').text(auFromMiles(distance));
		$('#selected-distance-ly').text(lyFromMiles(distance));
		$('#selected-distance-parsecs').text(parsecsFromMiles(distance));
		$('#selected-notes').text('');
	}
}

// module.exports = CelestialObject;