import os
import json
import csv
import datetime
import random

def parse_csv(file_path, query):
    with open(file_path, 'r') as f:
        reader = csv.DictReader(f)
        rows = [row for row in reader if all(row.get(key) == value for key, value in query.items())]
    return rows

def parse_global_data(file_path):
    total_dict = {}
    out = "yearly.csv"

    with open(file_path, 'r') as f:     
        reader = csv.DictReader(f)
        for row in reader:
            if row['Year'] in total_dict:
                total_dict[row['Year']] += float(row['Emissions'])
            else:
                total_dict[row['Year']] = float(row['Emissions'])
    
    with open(out, 'w',newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
    
        # Writing headers (optional)
        csv_writer.writerow(['Key', 'Value'])
        
        # Writing data of CSV file
        for key, value in total_dict.items():
            csv_writer.writerow([key, value])
    return 

# def parse_geojson(file_path):
#     with open(file_path, 'r') as f:
#         data = json.load(f)
#         for feature in data['features']:
#             if 'ADMIN' in feature['properties']:
#                 admin_name = feature['properties']['ADMIN']
#                 if parse_csv('emissions.csv',{'Entity': admin_name}):
#                     pass
#                 else:
#                     print(f"{admin_name} does not exist in the dictionary.")


# parse_geojson('data.geojson')
