// Importing necessary hooks from React
import { useState, useEffect } from 'react';

// Importing the PocketBase client for API interactions
import { pb } from '../services/pocketbaseClient';

/**
 * Custom React hook to fetch and manage data related to a specific model, including
 * related projects, models, and collaborators.
 *
 * @param {string} modelId - The ID of the model to be fetched.
 * @returns {object} An object containing the model data, loading state, related projects,
 * related models, collaborators, and functions to set these states.
 */
const useModel = (modelId) => {
  // State to hold the data of the specific model
  const [model, setModel] = useState(null);

  // State to indicate if the data is currently being fetched
  const [loading, setLoading] = useState(true);

  // State to hold data of projects related to the model
  const [relatedProjects, setRelatedProjects] = useState([]);

  // State to hold data of other models related to the current model
  const [relatedModels, setRelatedModels] = useState([]);

  // State to hold data of users collaborating on the model
  const [collaborators, setCollaborators] = useState([]);

  /**
   * Function to fetch the model data along with its related entities from the PocketBase API.
   *
   * @param {string} id - The ID of the model to fetch.
   */
  const fetchModel = async (id) => {
    // Set loading state to true to indicate the start of a data fetch
    setLoading(true);
    try {
      // Fetch the model data from the 'models' collection, expanding the 'collaborators' field
      const data = await pb.collection('models').getOne(id, { expand: 'collaborators' });
      
      // Set the fetched model data to the 'model' state
      setModel(data);

      // If the model has related projects, fetch details for each project
      if (data.related_projects && data.related_projects.length > 0) {
        const projectDetails = await Promise.all(
          data.related_projects.map(id => pb.collection('research_projects').getOne(id))
        );
        setRelatedProjects(projectDetails); // Update state with fetched project details
      } else {
        setRelatedProjects([]); // Reset state if no related projects
      }

      // If the model has related models, fetch details for each related model
      if (data.related_models && data.related_models.length > 0) {
        const modelDetails = await Promise.all(
          data.related_models.map(id => pb.collection('models').getOne(id))
        );
        setRelatedModels(modelDetails); // Update state with fetched related model details
      } else {
        setRelatedModels([]); // Reset state if no related models
      }

      // If the model has collaborators, fetch details for each collaborator
      if (data.collaborators && data.collaborators.length > 0) {
        const collaboratorDetails = await Promise.all(
          data.collaborators.map(async (collaboratorId) => {
            // Fetch each collaborator's details, expanding the 'profile_picture' field
            const user = await pb.collection('users').getOne(collaboratorId, { expand: 'profile_picture' });
            return user;
          })
        );
        setCollaborators(collaboratorDetails); // Update state with fetched collaborator details
      } else {
        setCollaborators([]); // Reset state if no collaborators
      }
    } catch (error) {
      // Log any errors encountered during the fetch
      console.error('Error fetching model:', error);
    } finally {
      // Set loading state to false, indicating the end of data fetch
      setLoading(false);
    }
  };

  // useEffect hook to trigger fetchModel whenever modelId changes
  useEffect(() => {
    fetchModel(modelId);
  }, [modelId]); // Dependencies array: runs when modelId changes

  // Return the state and functions to the component using this hook
  return {
    model,
    loading,
    relatedProjects,
    relatedModels,
    collaborators,
    setModel,
    fetchModel,
    setRelatedProjects,
    setRelatedModels,
    setCollaborators,
  };
};

export default useModel;
