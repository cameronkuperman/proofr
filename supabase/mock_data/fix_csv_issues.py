#!/usr/bin/env python3
import csv
import json
import uuid
import re

# Fix students.csv JSON arrays
def fix_students_csv():
    print("Fixing students.csv...")
    rows = []
    
    with open('students.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Convert PostgreSQL arrays to JSON arrays
            # Handle preferred_colleges
            if row['preferred_colleges']:
                colleges = row['preferred_colleges'].strip('{}')
                # Handle quoted values with commas
                colleges_list = []
                current = ""
                in_quotes = False
                for char in colleges:
                    if char == '"' and (not current or current[-1] != '\\'):
                        in_quotes = not in_quotes
                    elif char == ',' and not in_quotes:
                        if current.strip():
                            colleges_list.append(current.strip().strip('"'))
                        current = ""
                        continue
                    current += char
                if current.strip():
                    colleges_list.append(current.strip().strip('"'))
                row['preferred_colleges'] = json.dumps(colleges_list)
            
            # Handle interests
            if row['interests']:
                interests = row['interests'].strip('{}')
                interests_list = []
                current = ""
                in_quotes = False
                for char in interests:
                    if char == '"' and (not current or current[-1] != '\\'):
                        in_quotes = not in_quotes
                    elif char == ',' and not in_quotes:
                        if current.strip():
                            interests_list.append(current.strip().strip('"'))
                        current = ""
                        continue
                    current += char
                if current.strip():
                    interests_list.append(current.strip().strip('"'))
                row['interests'] = json.dumps(interests_list)
            
            # Handle pain_points
            if row['pain_points']:
                pain_points = row['pain_points'].strip('{}')
                pain_points_list = []
                current = ""
                in_quotes = False
                for char in pain_points:
                    if char == '"' and (not current or current[-1] != '\\'):
                        in_quotes = not in_quotes
                    elif char == ',' and not in_quotes:
                        if current.strip():
                            pain_points_list.append(current.strip().strip('"'))
                        current = ""
                        continue
                    current += char
                if current.strip():
                    pain_points_list.append(current.strip().strip('"'))
                row['pain_points'] = json.dumps(pain_points_list)
            
            # budget_range is already in correct format [50,150]
            # metadata should be empty object if empty
            if row['metadata'] == '{}':
                row['metadata'] = '{}'
                
            rows.append(row)
    
    # Write back
    with open('students.csv', 'w', newline='') as f:
        fieldnames = rows[0].keys()
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print("Fixed students.csv")

# Fix consultant_waitlist.csv UUIDs
def fix_consultant_waitlist_csv():
    print("Fixing consultant_waitlist.csv...")
    rows = []
    
    with open('consultant_waitlist.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Replace placeholder UUIDs
            if row['id'].startswith('cw'):
                row['id'] = str(uuid.uuid4())
            rows.append(row)
    
    # Write back
    with open('consultant_waitlist.csv', 'w', newline='') as f:
        fieldnames = rows[0].keys()
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print("Fixed consultant_waitlist.csv")

# Fix services.csv prices
def fix_services_csv():
    print("Fixing services.csv...")
    rows = []
    
    with open('services.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Ensure prices is not empty
            if not row['prices'] or row['prices'] == '':
                # Set a default price
                row['prices'] = '{50}'
            rows.append(row)
    
    # Write back
    with open('services.csv', 'w', newline='') as f:
        fieldnames = rows[0].keys()
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print("Fixed services.csv")

# Fix user_interactions.csv enum values
def fix_user_interactions_csv():
    print("Fixing user_interactions.csv...")
    rows = []
    
    # Valid enum values based on schema
    valid_interaction_types = ['view', 'bookmark', 'message', 'booking']
    
    with open('user_interactions.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Replace 'search' with 'view'
            if row['interaction_type'] == 'search':
                row['interaction_type'] = 'view'
            elif row['interaction_type'] not in valid_interaction_types:
                row['interaction_type'] = 'view'  # Default to view
            rows.append(row)
    
    # Write back
    with open('user_interactions.csv', 'w', newline='') as f:
        fieldnames = rows[0].keys()
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print("Fixed user_interactions.csv")

# Fix group_session_participants.csv UUIDs
def fix_group_session_participants_csv():
    print("Fixing group_session_participants.csv...")
    rows = []
    
    with open('group_session_participants.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Replace placeholder UUIDs
            if row['id'].startswith('gsp'):
                row['id'] = str(uuid.uuid4())
            rows.append(row)
    
    # Write back
    with open('group_session_participants.csv', 'w', newline='') as f:
        fieldnames = rows[0].keys()
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print("Fixed group_session_participants.csv")

if __name__ == '__main__':
    fix_students_csv()
    fix_consultant_waitlist_csv()
    fix_services_csv()
    fix_user_interactions_csv()
    fix_group_session_participants_csv()
    print("\nAll CSV files fixed!")