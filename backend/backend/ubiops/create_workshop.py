import ubiops 
import tempfile

import pandas as pd

import shutil
import os
import requests

# Connect with your UbiOps environment
# Make sure this is in the format "Token token-code"
API_TOKEN = 'Token 00000000000000000000000000'

# Obviously edit this.
PROJECT_NAME = 'lab-it-workshop'

DEPLOYMENT_VERSION = 'v1'

client = ubiops.ApiClient(ubiops.Configuration(api_key={'Authorization': API_TOKEN}, 
                                               host='https://api.ubiops.com/v2.1'))
api = ubiops.CoreApi(client)

# print(api.projects_get(PROJECT_NAME))

# print(api.deployments_get(PROJECT_NAME, 'tester'))

# print(api.deployment_versions_get(PROJECT_NAME, 'tester', 'v1'))

import re

def shortenName(name):
	output = ""
	for partName in name.split(' '):
		output += re.sub(r'[\W_]+', '', partName)[:3] + '-'
	return output.lower()

data = pd.read_excel('adresses.xlsx')

for index, row in data.iterrows():
	YOUR_NAME = shortenName(row['Naam'])
	# print(YOUR_NAME)
	print(row['E-mail'])
	
	DEPLOYMENT_NAME = YOUR_NAME + 'workshop'
	
	print(DEPLOYMENT_NAME)

	# Create the deployment
	deployment_template = ubiops.DeploymentCreate(
		name=DEPLOYMENT_NAME,
		description='Jupyter Notebook Deployment',
		input_type='structured',
		output_type='structured',
		input_fields=[
		],
		output_fields=[
			{'name':'notebook_url', 'data_type':'string'}
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
		maximum_idle_time=300, # = 5 minutes
# 		request_retention_mode='none', # we don't need request storage in this example
		ports = [{'public_port' : 8888, 'deployment_port' : 8888, 'protocol': 'tcp'}]
	)

	api.deployment_versions_create(
		project_name=PROJECT_NAME,
		deployment_name=DEPLOYMENT_NAME,
		data=version_template
	)

	# Zip the deployment package
	# shutil.make_archive('jupyterDeployment', 'zip', '.', 'jupyterDeployment')

	# Upload the zipped deployment package
	file_upload_result1 = api.revisions_file_upload(
		project_name=PROJECT_NAME,
		deployment_name=DEPLOYMENT_NAME,
		version=DEPLOYMENT_VERSION,
		file='jupyterDeployment.zip'
	)
