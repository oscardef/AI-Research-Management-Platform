import ubiops from 'ubiops';

const API_TOKEN = 'Token 00000000000000000000000000';
const PROJECT_NAME = 'lab-it-workshop';

const client = new ubiops.ApiClient({
  apiKey: { 'Authorization': API_TOKEN },
  host: 'https://api.ubiops.com/v2.1',
});

export const api = new ubiops.CoreApi(client);

export const createDeployment = async (deploymentName, deploymentVersion) => {
  const deploymentTemplate = {
    name: deploymentName,
    description: 'Hosts a trained model.',
    input_type: 'structured',
    output_type: 'structured',
    input_fields: [{ name: 'image', data_type: 'file' }],
    output_fields: [{ name: 'judgement', data_type: 'string' }],
    labels: { workshop: 'Zwolle' },
  };

  const versionTemplate = {
    version: deploymentVersion,
    environment: 'jupyter-gpu',
    instance_type: '16384mb_t4',
    minimum_instances: 0,
    maximum_instances: 1,
    maximum_idle_time: 300, // 5 minutes
  };

  await api.deployments_create(PROJECT_NAME, deploymentTemplate);
  await api.deployment_versions_create(PROJECT_NAME, deploymentName, versionTemplate);

  return { deploymentName, deploymentVersion };
};
