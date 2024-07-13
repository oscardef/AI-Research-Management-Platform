import requests
import json
import os

# URL of your PocketBase instance
POCKETBASE_URL = "http://127.0.0.1:8090"

# Admin credentials
ADMIN_EMAIL = "oscar.defrancesca@gmail.com"
ADMIN_PASSWORD = "0123456789"

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
    inserted_ids = []
    for item in data:
        response = requests.post(url, headers=headers, json=item)
        if response.status_code == 200:
            inserted_ids.append(response.json()['id'])
            print(f"Inserted into {collection_name}: {response.json()['id']}")
        else:
            print(f"Failed to insert into {collection_name}: {response.text}")
    return inserted_ids

def main():
    token = authenticate()
    if not token:
        return

    # Read test data from JSON files
    users = read_json_file('users.json')
    profiles = read_json_file('profiles.json')
    projects = read_json_file('research_projects.json')
    models = read_json_file('models.json')

    # Insert data into collections
    user_ids = insert_data("users", users, token)
    insert_data("profiles", profiles, token)

    project_ids = insert_data("research_projects", projects, token)
    model_ids = insert_data("models", models, token)

    # Optionally, you can add logic to update projects and models with real IDs if needed

if __name__ == "__main__":
    main()
