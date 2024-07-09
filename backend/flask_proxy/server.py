from flask import Flask, request, jsonify
import ubiops
import tempfile
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

UBI_OPS_API_TOKEN = os.getenv('UBI_OPS_API_TOKEN')

@app.route('/deploy', methods=['POST'])
def deploy():
    data = request.json
    project_name = data.get('project_name')
    deployment_name = data.get('deployment_name')
    deployment_description = data.get('deployment_description')
    deployment_version = data.get('deployment_version')
    file_url = data.get('file_url')
    

    if not all([project_name, deployment_description, deployment_name, deployment_version, file_url]):
        return jsonify({'error': 'Missing required parameters'}), 400

    try:
        # Connect to UbiOps
        client = ubiops.ApiClient(ubiops.Configuration(
            api_key={'Authorization': f'Token {UBI_OPS_API_TOKEN}'},
            host='https://api.ubiops.com/v2.1'
        ))
        api = ubiops.CoreApi(client)

        # Check if deployment already exists
        existing_deployments = api.deployments_list(project_name=project_name)
        if any(deployment.name == deployment_name for deployment in existing_deployments):
            # Deployment exists, ask if user wants to override
            return jsonify({'error': f"Deployment '{deployment_name}' already exists. Do you want to override?"}), 409

        # Create the deployment
        deployment_template = ubiops.DeploymentCreate(
            name=deployment_name,
            description=deployment_description,
            input_type='structured',
            output_type='structured',
            input_fields=[
                {'name': 'image', 'data_type': 'file'}
            ],
            output_fields=[
                {'name': 'judgement', 'data_type': 'string'}
            ],
        )

        api.deployments_create(
            project_name=project_name,
            data=deployment_template
        )

        # Create the version
        version_template = ubiops.DeploymentVersionCreate(
            version=deployment_version,
            environment='ubuntu22-04-python3-10-cuda11-7-1',  # Updated environment
            instance_type='16384mb_t4',
            minimum_instances=0,
            maximum_instances=1,
            maximum_idle_time=300
        )

        api.deployment_versions_create(
            project_name=project_name,
            deployment_name=deployment_name,
            data=version_template
        )

        # Download the file from PocketBase URL
        response = requests.get(file_url)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to download the file'}), 400

        # Save the file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name

        # Upload the file to UbiOps
        file_upload_result = api.revisions_file_upload(
            project_name=project_name,
            deployment_name=deployment_name,
            version=deployment_version,
            file=temp_file_path
        )

        # Cleanup the temporary file
        os.remove(temp_file_path)

        return jsonify({'message': 'Deployment successful'}), 200

    except ubiops.exceptions.ApiException as e:
        print(f"Error during deployment: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/override_deployment', methods=['POST'])
def override_deployment():
    data = request.json
    project_name = data.get('project_name')
    deployment_name = data.get('deployment_name')
    deployment_description = data.get('deployment_description')
    deployment_version = data.get('deployment_version')
    file_url = data.get('file_url')

    if not all([project_name, deployment_description, deployment_name, deployment_version, file_url]):
        return jsonify({'error': 'Missing required parameters'}), 400

    try:
        # Connect to UbiOps
        client = ubiops.ApiClient(ubiops.Configuration(
            api_key={'Authorization': f'Token {UBI_OPS_API_TOKEN}'},
            host='https://api.ubiops.com/v2.1'
        ))
        api = ubiops.CoreApi(client)

        # Delete the existing deployment
        api.deployments_delete(
            project_name=project_name,
            deployment_name=deployment_name
        )

        # Create the deployment
        deployment_template = ubiops.DeploymentCreate(
            name=deployment_name,
            description=deployment_description,
            input_type='structured',
            output_type='structured',
            input_fields=[
                {'name': 'image', 'data_type': 'file'}
            ],
            output_fields=[
                {'name': 'judgement', 'data_type': 'string'}
            ],
        )

        api.deployments_create(
            project_name=project_name,
            data=deployment_template
        )

        # Create the version
        version_template = ubiops.DeploymentVersionCreate(
            version=deployment_version,
            environment='ubuntu22-04-python3-10-cuda11-7-1',
            instance_type='16384mb_t4',
            minimum_instances=0,
            maximum_instances=1,
            maximum_idle_time=300
        )

        api.deployment_versions_create(
            project_name=project_name,
            deployment_name=deployment_name,
            data=version_template
        )

        # Download the file from PocketBase URL
        response = requests.get(file_url)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to download the file'}), 400

        # Save the file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name

        # Upload the file to UbiOps
        file_upload_result = api.revisions_file_upload(
            project_name=project_name,
            deployment_name=deployment_name,
            version=deployment_version,
            file=temp_file_path
        )

        # Cleanup the temporary file
        os.remove(temp_file_path)

        return jsonify({'message': 'Deployment overridden successfully'}), 200

    except ubiops.exceptions.ApiException as e:
        print(f"Error during deployment: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
