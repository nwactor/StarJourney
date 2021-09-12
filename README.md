# Star Journey

Star Journey is an interactive viewport to the solar system and beyond. The large circle in the center of your screen represents 180 degrees of vision, and all of the objects you see within it are sized accordingly based on your distance to them.
For example, from Earth, the moon appears to have an angular diameter of 0.5 degrees on average. This means that if you move to the location of the Earth within Star Journey, the moon will appear to have 1/360th the diameter of your viewport.

## Controls

### General Movement

Now you can control your direction with the arrow keys and move by holding down or tapping space. Give it a try and you'll quickly find yourself whizzing through the inner solar system!

### Object Selection

You can hover over a star or planet to surround it with a frame and see its name. Clicking will center your view on that celestial body so that you can move straight towards it! It is easy to pass an object without realizing it because space is big and these stars and planets are relatively small. If the object you are moving towards suddenly dissapears, try turning around with the arrow keys. You might see your destination looming straight behind you!

### Setting Direction

You can update the direction you are facing in three ways. The first is that you can use the control buttons, which will rotate you 5 degrees in the direction that you press. The second is by updating your rotation manually in the Viewport Rotation section, above the control buttons.
Finally, you can also click on an object in the viewport, and it will automatically center on that object.

### Setting Position

Currently, you can update your position with the Viewport Position controls to the right of the viewport. The program uses a 3d cartesian coordinate system with an x, y, and z axis, with our sun at the origin point.
One unit of distance is equal to one mile.

### Jumping

You can also update your position by "jumping" forward using the jump button. To control the distance that you jump, update the value in the jump distance input box. You can also jump by pressing the space bar.


## Local Setup

Star Journey currently does not rely on any external libraries or servers and so can be run straight from your browser without any internet connection. Since it is just a static webpage, setup is only two steps:

1. Download this repository.
2. Navigate to root of the directory and open index.html with your browser.

## How Does it Work?

### The Data

Astronomers have compiled many star catalogs, but believe it or not, as far as I'm aware there isn't a famous one out there that orders the stars by their distance to the Earth. So, I decided to make my own catalog, which you can find in the StarDatabaseOngoing.xlsx file in the data directory of the project. To create it, I took the HYG database (you can find file containing that in the same folder) filtered it to get the stars I was interested in using a script I named hygFilter.py, and then using the output (filtered_stars) as a base I manually compiled my list. Finally, in order to convert StarDatabaseOngoing into a format that is useable by Star Journey, I exported the data into a .csv (comma separated value) file and parsed that data into json with the calcXYZ.py script, the output of that being StarJson.json and StarData.js.

The planets of our own Solar System are loaded with a simpler approach. Because there are fewer than 10 of them, those objects are manually created in the space.js file in the root directory of the repository.

### Displaying it All (The Math)

Simply put, the viewport finds the relative position of every celestial body to itself, converts that to a spherical coordinate, and then checks whether that spherical coordinate is visible or not given which way the viewport is looking. An in-depth explanation with diagrams is coming up next...
