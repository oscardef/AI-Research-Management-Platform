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

def adjust_ids(data, prefix):
    for idx, item in enumerate(data):
        item['id'] = f"{prefix}{idx+1:012}"
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

    # Adjust IDs
    users = adjust_ids(users, "user")
    projects = adjust_ids(projects, "project")
    models = adjust_ids(models, "model")

    # Remove profile pictures or set a placeholder
    for user in users:
        user.pop('profile_picture', None)
        # Alternatively, set a placeholder if needed:
        # user['profile_picture'] = "placeholder.png"

    # Insert data into collections
    user_ids = insert_data("users", users, token)
    profile_data = []
    for profile in profiles:
        if profile["user"] in user_ids:
            profile_data.append(profile)
    insert_data("profiles", profile_data, token)

    project_ids = insert_data("research_projects", projects, token)
    model_ids = insert_data("models", models, token)

    # Update projects and models with real IDs if needed
    for project in projects:
        project["related_projects"] = [pid for pid in project["related_projects"] if pid in project_ids]
        project["related_models"] = [mid for mid in project["related_models"] if mid in model_ids]
    for model in models:
        model["related_projects"] = [pid for pid in model["related_projects"] if pid in project_ids]
        model["related_models"] = [mid for mid in model["related_models"] if mid in model_ids]

    insert_data("research_projects", projects, token)
    insert_data("models", models, token)

if __name__ == "__main__":
    main()
