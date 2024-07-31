import json
import os
import uuid

# Define the paths to the JSON files
users_file_path = 'users.json'
profiles_file_path = 'profiles.json'
research_projects_file_path = 'research_projects.json'
models_file_path = 'models.json'

def generate_new_id():
    return str(uuid.uuid4().hex)[:15]

def update_ids(data, id_mapping, related_fields):
    for item in data:
        old_id = item['id']
        if old_id not in id_mapping:
            new_id = generate_new_id()
            id_mapping[old_id] = new_id
        item['id'] = id_mapping[old_id]
        
        for field in related_fields:
            if field in item and isinstance(item[field], list):
                for rel_id in item[field]:
                    if rel_id not in id_mapping:
                        id_mapping[rel_id] = generate_new_id()
                item[field] = [id_mapping[rel_id] for rel_id in item[field]]
    
    return data

def update_related_fields(data, id_mapping, related_fields):
    for item in data:
        for field in related_fields:
            if field in item and isinstance(item[field], list):
                item[field] = [id_mapping.get(rel_id, rel_id) for rel_id in item[field]]
    
    return data

def main():
    id_mapping = {}
    
    # Load the JSON data
    with open(users_file_path, 'r') as file:
        users_data = json.load(file)
    
    with open(profiles_file_path, 'r') as file:
        profiles_data = json.load(file)
    
    with open(research_projects_file_path, 'r') as file:
        research_projects_data = json.load(file)
    
    with open(models_file_path, 'r') as file:
        models_data = json.load(file)
    
    # Update IDs and related fields
    users_data = update_ids(users_data, id_mapping, [])
    profiles_data = update_related_fields(profiles_data, id_mapping, ['user'])
    research_projects_data = update_ids(research_projects_data, id_mapping, ['related_projects', 'related_models'])
    models_data = update_ids(models_data, id_mapping, ['related_projects', 'related_models'])
    
    # Save the updated data back to the JSON files
    with open(users_file_path, 'w') as file:
        json.dump(users_data, file, indent=4)
    
    with open(profiles_file_path, 'w') as file:
        json.dump(profiles_data, file, indent=4)
    
    with open(research_projects_file_path, 'w') as file:
        json.dump(research_projects_data, file, indent=4)
    
    with open(models_file_path, 'w') as file:
        json.dump(models_data, file, indent=4)
    
    print("IDs updated and related fields adjusted.")

if __name__ == "__main__":
    main()
