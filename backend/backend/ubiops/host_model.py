import ubiops 
import tempfile

import shutil
import os
import requests

# Connect with your UbiOps environment
# Make sure this is in the format "Token token-code"
API_TOKEN = 'Token 00000000000000000000000000'

# Obviously edit this.
PROJECT_NAME = 'lab-it-workshop'

DEPLOYMENT_NAME = 'hosted-model'

DEPLOYMENT_VERSION = 'v1'

client = ubiops.ApiClient(ubiops.Configuration(api_key={'Authorization': API_TOKEN}, 
                                               host='https://api.ubiops.com/v2.1'))
api = ubiops.CoreApi(client)

# Create the deployment
deployment_template = ubiops.DeploymentCreate(
	name=DEPLOYMENT_NAME,
	description='Hosts a trained model.',
	input_type='structured',
	output_type='structured',
	input_fields=[
		{'name': 'image', 'data_type': 'file'}
	],
	output_fields=[
		{'name': 'judgement', 'data_type': 'string'}
	],
	labels={'workshop': 'Zwolle'}
)

api.deployments_create(
	project_name=PROJECT_NAME,
	data=deployment_template
)

# https://github.com/UbiOps/client-library-python/blob/master/docs/models/DeploymentVersionPort.md

# Create the version
version_template = ubiops.DeploymentVersionCreate(
	version=DEPLOYMENT_VERSION,
	environment='jupyter-gpu',
	instance_type='16384mb_t4',
	minimum_instances=0,
	maximum_instances=1,
	maximum_idle_time=300 # = 5 minutes
)

api.deployment_versions_create(
	project_name=PROJECT_NAME,
	deployment_name=DEPLOYMENT_NAME,
	data=version_template
)

# Zip the deployment package
shutil.make_archive('modelHoster', 'zip', '.', 'modelHoster')

# Upload the zipped deployment package
file_upload_result1 = api.revisions_file_upload(
	project_name=PROJECT_NAME,
	deployment_name=DEPLOYMENT_NAME,
	version=DEPLOYMENT_VERSION,
	file='modelHoster.zip'
)
