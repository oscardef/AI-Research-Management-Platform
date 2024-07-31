// Importing necessary hooks from React
import { useState, useEffect } from 'react';

// Importing the PocketBase client for API interactions
import { pb } from '../services/pocketbaseClient';

/**
 * Custom React hook to fetch and manage data related to a specific project, including
 * related projects, models, publications, and collaborators.
 *
 * @param {string} projectId - The ID of the project to be fetched.
 * @returns {object} An object containing the project data, loading state, related projects,
 * related models, related publications, collaborators, and functions to set these states.
 */
const useProject = (projectId) => {
  // State to hold the data of the specific project
  const [project, setProject] = useState(null);

  // State to indicate if the data is currently being fetched
  const [loading, setLoading] = useState(true);

  // State to hold data of projects related to the current project
  const [relatedProjects, setRelatedProjects] = useState([]);

  // State to hold data of models related to the project
  const [relatedModels, setRelatedModels] = useState([]);

  // State to hold data of publications related to the project
  const [relatedPublications, setRelatedPublications] = useState([]);

  // State to hold data of users collaborating on the project
  const [collaborators, setCollaborators] = useState([]);

  /**
   * Function to fetch the project data along with its related entities from the PocketBase API.
   *
   * @param {string} id - The ID of the project to fetch.
   */
  const fetchProject = async (id) => {
    // Set loading state to true to indicate the start of a data fetch
    setLoading(true);
    try {
      // Fetch the project data from the 'research_projects' collection, expanding the 'collaborators' field
      const data = await pb.collection('research_projects').getOne(id, { expand: 'collaborators' });
      
      // Set the fetched project data to the 'project' state
      setProject(data);

      // If the project has related projects, fetch details for each project
      if (data.related_projects && data.related_projects.length > 0) {
        const projectDetails = await Promise.all(
          data.related_projects.map(id => pb.collection('research_projects').getOne(id))
        );
        setRelatedProjects(projectDetails); // Update state with fetched project details
      } else {
        setRelatedProjects([]); // Reset state if no related projects
      }

      // If the project has related models, fetch details for each related model
      if (data.related_models && data.related_models.length > 0) {
        const modelDetails = await Promise.all(
          data.related_models.map(id => pb.collection('models').getOne(id))
        );
        setRelatedModels(modelDetails); // Update state with fetched related model details
      } else {
        setRelatedModels([]); // Reset state if no related models
      }

      // If the project has collaborators, fetch details for each collaborator
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

      // If the project has related publications, set them directly as they are already fetched
      if (data.related_publications && data.related_publications.length > 0) {
        setRelatedPublications(data.related_publications);
      } else {
        setRelatedPublications([]); // Reset state if no related publications
      }
    } catch (error) {
      // Log any errors encountered during the fetch
      console.error('Error fetching project:', error);
    } finally {
      // Set loading state to false, indicating the end of data fetch
      setLoading(false);
    }
  };

  // useEffect hook to trigger fetchProject whenever projectId changes
  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]); // Dependencies array: runs when projectId changes

  // Return the state and functions to the component using this hook
  return {
    project, // The fetched project data
    loading, // The loading state
    relatedProjects, // The related projects data
    relatedModels, // The related models data
    relatedPublications, // The related publications data
    collaborators, // The collaborators data
    setProject, // Setter for the project state
    fetchProject, // Function to fetch the project data
    setRelatedProjects, // Setter for the related projects state
    setRelatedModels, // Setter for the related models state
    setRelatedPublications, // Setter for the related publications state
    setCollaborators, // Setter for the collaborators state
  };
};

export default useProject;
