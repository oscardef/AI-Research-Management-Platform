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

	# Delete the deployment
	api.deployments_delete(
		project_name=PROJECT_NAME,
		deployment_name=DEPLOYMENT_NAME
	)
