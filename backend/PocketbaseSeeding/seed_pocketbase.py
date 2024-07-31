import requests
import json
import os
import random
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# URL of your PocketBase instance
POCKETBASE_URL = "http://127.0.0.1:8090"

# Admin credentials from environment variables
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

def authenticate():
    url = f"{POCKETBASE_URL}/api/admins/auth-with-password"
    data = {
        "identity": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        auth_data = response.json()
        token = auth_data['token']
        print("Authentication successful.")
        return token
    else:
        print(f"Failed to authenticate: {response.text}")
        return None

def read_json_file(file_name):
    with open(file_name, 'r') as file:
        data = json.load(file)
    return data

def insert_data(collection_name, data, token):
    url = f"{POCKETBASE_URL}/api/collections/{collection_name}/records"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    inserted_ids = {}
    for item in data:
        original_id = item['id']
        # Remove related fields before initial insertion
        item.pop('related_projects', None)
        item.pop('related_models', None)
        response = requests.post(url, headers=headers, json=item)
        if response.status_code == 200:
            new_id = response.json()['id']
            inserted_ids[original_id] = new_id
            print(f"Inserted into {collection_name}: {new_id}")
        else:
            print(f"Failed to insert into {collection_name}: {response.text}")
    return inserted_ids

def update_related_fields(collection_name, data, token):
    url = f"{POCKETBASE_URL}/api/collections/{collection_name}/records"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    for item in data:
        update_url = f"{url}/{item['id']}"
        response = requests.patch(update_url, headers=headers, json=item)
        if response.status_code == 200:
            print(f"Updated {collection_name}: {item['id']}")
        else:
            print(f"Failed to update {collection_name}: {response.text}")

def add_random_items(item, ids, field_name, min_count=3, max_count=5):
    num_items = random.randint(min_count, max_count)
    selected_items = random.sample(list(ids.values()), num_items)
    item[field_name] = selected_items

def main():
    token = authenticate()
    if not token:
        return

    # Read test data from JSON files
    current_directory = os.path.dirname(os.path.abspath(__file__))
    users = read_json_file(os.path.join(current_directory, 'users.json'))
    profiles = read_json_file(os.path.join(current_directory, 'profiles.json'))
    projects = read_json_file(os.path.join(current_directory, 'research_projects.json'))
    models = read_json_file(os.path.join(current_directory, 'models.json'))

    # Remove profile pictures or set a placeholder
    for user in users:
        user.pop('profile_picture', None)

    # Insert data into collections and get mapping of original to new IDs
    user_ids = insert_data("users", users, token)
    profile_data = []
    for profile in profiles:
        if profile["user"] in user_ids:
            profile["user"] = user_ids[profile["user"]]
            profile_data.append(profile)
    profile_ids = insert_data("profiles", profile_data, token)

    project_ids = insert_data("research_projects", projects, token)
    model_ids = insert_data("models", models, token)

    # Update related fields in projects and models with random related items and collaborators
    for project in projects:
        add_random_items(project, project_ids, 'related_projects')
        add_random_items(project, model_ids, 'related_models')
        add_random_items(project, user_ids, 'collaborators')
    for model in models:
        add_random_items(model, project_ids, 'related_projects')
        add_random_items(model, model_ids, 'related_models')
        add_random_items(model, user_ids, 'collaborators')

    update_related_fields("research_projects", projects, token)
    update_related_fields("models", models, token)

if __name__ == "__main__":
    main()
