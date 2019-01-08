class CelestialObject {
	constructor(name, color, radius, position) {
		this.name = name;
		this.color = color;
		this.radius = radius;
		this.position = position;
	}
	displayOnViewport(viewport, coordinates) {
		var appearance = $('<div>');
		appearance.attr("id", this.name);
		appearance.addClass("celestialObject");

		var top = 50 - ((coordinates.y / 100) * 50);
		var left = 50 + ((coordinates.x / 100) * 50);
		appearance[0].style.top = top + "%";
		appearance[0].style.left = left + "%";

		//show a circle with diameter = (apparentAngle / viewport.FoV) * height 
		appearance.css("background-color", this.color);

		var diameter = (this.getApparentSize(viewPort.position).degrees) / (viewPort.fieldOfView);
		diameter *= (window.innerHeight * .95);

		//visibility protection for when the object is smaller than one pixel
		if(diameter < 2 && diameter > .0000001) {
			diameter = 2;
		}

		appearance.height(diameter);
		appearance.width(diameter);

		//account for the object's diameter when displaying the div
		appearance[0].style["-webkit-transform"] = "translate(-50%, -50%)";

		//make object show its name when hovered over
		appearance.on('mouseover', () => {
			appearance.height(appearance.height() + 2);
			appearance.width(appearance.width() + 2);

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

			frame[0].style.border = "1px solid red";
			frame[0].style.top = appearance[0].style.top;
			frame[0].style.left = appearance[0].style.left;
			frame[0].style["-webkit-transform"] = "translate(-50%, -50%)";

			let frameLabel = $('<span>');
			frameLabel.text(this.name);
			frameLabel[0].style.color = 'white';
			frameLabel[0].style.position = 'absolute';
			frameLabel[0].style.top = -1 * frameLabel.height();

			frame.append(frameLabel);
			$('#viewport').prepend(frame);
		});

		//remove name when no longer hovered over
		appearance.on('mouseout', () => {
			appearance.height(appearance.height() - 2);
			appearance.width(appearance.width() - 2);

			//remove the frame
			$('.frame').remove();
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
}

// module.exports = CelestialObject;