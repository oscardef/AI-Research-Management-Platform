import { useState, useEffect } from 'react';
import { pb } from '../services/pocketbaseClient';

const useModel = (modelId) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [relatedModels, setRelatedModels] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  const fetchModel = async (id) => {
    setLoading(true);
    try {
      const data = await pb.collection('models').getOne(id, { expand: 'collaborators' });
      setModel(data);

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
    } catch (error) {
      console.error('Error fetching model:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModel(modelId);
  }, [modelId]);

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
