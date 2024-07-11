import { useState, useEffect } from 'react';
import { pb } from '../services/pocketbaseClient';

const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [relatedModels, setRelatedModels] = useState([]);
  const [relatedPublications, setRelatedPublications] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  const fetchProject = async (id) => {
    setLoading(true);
    try {
      const data = await pb.collection('research_projects').getOne(id, { expand: 'collaborators' });
      setProject(data);

      if (data.related_projects && data.related_projects.length > 0) {
        const projectDetails = await Promise.all(
          data.related_projects.map(id => pb.collection('research_projects').getOne(id))
        );
        setRelatedProjects(projectDetails);
      } else {
        setRelatedProjects([]);
      }

      if (data.related_models && data.related_models.length > 0) {
        const modelDetails = await Promise.all(
          data.related_models.map(id => pb.collection('models').getOne(id))
        );
        setRelatedModels(modelDetails);
      } else {
        setRelatedModels([]);
      }

      if (data.collaborators && data.collaborators.length > 0) {
        const collaboratorDetails = await Promise.all(
          data.collaborators.map(async (collaboratorId) => {
            const user = await pb.collection('users').getOne(collaboratorId, { expand: 'profile_picture' });
            return user;
          })
        );
        setCollaborators(collaboratorDetails);
      } else {
        setCollaborators([]);
      }

      if (data.related_publications && data.related_publications.length > 0) {
        setRelatedPublications(data.related_publications);
      } else {
        setRelatedPublications([]);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]);

  return {
    project,
    loading,
    relatedProjects,
    relatedModels,
    relatedPublications,
    collaborators,
    setProject,
    fetchProject,
    setRelatedProjects,
    setRelatedModels,
    setRelatedPublications,
    setCollaborators,
  };
};

export default useProject;
