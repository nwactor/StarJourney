import os
try:
	os.remove('filtered_stars.csv')
except:
	pass

def parsecs_from_LY(ly):
	return ly * 0.306601

stars = open('hygdata_v3.csv', 'r')

body = stars.read()
stars.close()


table = body.split('\n')
table = [row.split(',') for row in table]
table_data = table[1:]

# print(table_data[1000][9])
# ten_parsecs = [row for row in table_data if float(row[9]) < 10]
selected_stars = []
for i in range(len(table_data)):
	if len(table_data[i]) >= 10:
		if float(table_data[i][9]) <= parsecs_from_LY(15) and i != 0:
			selected_stars.append(table_data[i])

selected_stars = sorted(selected_stars, key = lambda star: float(star[9]))

if len(selected_stars) <= 5:
	print(selected_stars)
	# pass
print(len(selected_stars))



#convert back to a string
selected_stars = [','.join(row) for row in selected_stars]
selected_stars = '\n'.join(selected_stars)
selected_stars = str(table[0]) + '\n' + str(selected_stars)

filtered_stars_file = open('filtered_stars.csv', 'w')
filtered_stars_file.write(selected_stars)
filtered_stars_file.close()