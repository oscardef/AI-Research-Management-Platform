// useProject.js
import { useState, useEffect } from 'react';
import { pb } from '../services/pocketbaseClient';

const useProject = (projectId) => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProjects, setRelatedProjects] = useState([]);
    const [relatedModels, setRelatedModels] = useState([]);
    const [relatedPublications, setRelatedPublications] = useState([]);
    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await pb.collection('research_projects').getOne(projectId);
                setProject(data);

                if (data.related_projects && data.related_projects.length > 0) {
                    const projectDetails = await Promise.all(
                        data.related_projects.map(id => pb.collection('research_projects').getOne(id))
                    );
                    setRelatedProjects(projectDetails);
                }

                if (data.related_models && data.related_models.length > 0) {
                    const modelDetails = await Promise.all(
                        data.related_models.map(id => pb.collection('models').getOne(id))
                    );
                    setRelatedModels(modelDetails);
                }

                if (data.collaborators && data.collaborators.length > 0) {
                    const collaboratorDetails = await Promise.all(
                        data.collaborators.map(id => pb.collection('users').getOne(id))
                    );
                    setCollaborators(collaboratorDetails);
                }

                if (data.related_publications && data.related_publications.length > 0) {
                    setRelatedPublications(data.related_publications);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    return {
        project,
        loading,
        relatedProjects,
        relatedModels,
        relatedPublications,
        collaborators,
        setProject,
        setRelatedProjects,
        setRelatedModels,
        setRelatedPublications,
        setCollaborators,
    };
};

export default useProject;
