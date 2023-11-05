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

