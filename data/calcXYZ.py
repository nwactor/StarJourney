import math

stars = open('StarDatabaseOngoing.csv', 'r')

body = stars.read()
stars.close()

table = body.split('\n')
table = [row.split(',') for row in table]

table_headers = table[:1][0]
table_headers[0] = "ID"
table_data = table[1:]

table_data_dict = [{table_headers[i]:row[i] for i in range(len(row))} for row in table_data]
# print(table_data_dict)

def hours_to_degrees(hours):
	return (float(hours) / 24) * 360

def degrees_to_radians(degrees):
	return float(degrees) * (math.pi / 180)

# assumes that the viewer is at position 0,0,0
def get_position_from_ra_and_dec(distance, ra, dec):
		xPos = math.cos(degrees_to_radians(hours_to_degrees(ra))) * float(distance)
		yPos = math.sin(degrees_to_radians(hours_to_degrees(ra))) * float(distance)
		zPos = math.sin(degrees_to_radians(dec)) * float(distance)

		return xPos, yPos, zPos

for star in table_data_dict:
	# print(star)
	if(star['ID'] != ''):
		x,y,z = get_position_from_ra_and_dec(star['Distance (Parsecs)'], star['Right Ascension'], star['Declination'])
		star['X'] = x
		star['Y'] = y
		star['Z'] = z

StarDataJS = open('StarData.js', 'w')

#-1 is to slice out the accidental empty one at the end
star_json = str(table_data_dict[:-1]).replace("'", '"').replace('"s ', "\'s ")
star_content = "var starData = " + star_json

StarDataJS.write(star_content)
StarDataJS.close()