import json

json_data = {}
with open('WEB_ONLY/catalog.csv') as f:
	datalines = f.readlines()[1:]
	for line in datalines:
		line_arr = line.strip("\n").split(",")
		prod_id = int(line_arr[0])
		prod_name = ",".join(line_arr[1:-2])
		department_id = int(line_arr[-2])
		price = float(line_arr[-1])

		catalog_entry = {}
		catalog_entry['prod_id'] = prod_id
		catalog_entry['prod_name'] = prod_name
		catalog_entry['department_id'] = department_id
		catalog_entry['price'] = price

		json_data[prod_id] = catalog_entry

with open('WEB_ONLY/catalog.json', 'w') as json_file:
	json.dump(json_data, json_file, ensure_ascii=False)