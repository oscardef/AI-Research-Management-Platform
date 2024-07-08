// useProject.js
import { useState, useEffect } from 'react';
import { pb } from '../services/pocketbaseClient';

const useProject = (projectId) => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProjects, setRelatedProjects] = useState([]);
    const [relatedModels, setRelatedModels] = useState([]);
    const [relatedPublications, setRelatedPublications] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await pb.collection('research_projects').getOne(projectId, {
                    expand: 'related_projects,related_models,related_publications'
                });
                setProject({
                    ...data,
                    related_projects: data.related_projects || [],
                    related_models: data.related_models || [],
                    related_publications: data.related_publications || []
                });

                if (data.related_projects && data.related_projects.length > 0) {
                    const projectDetails = await pb.collection('research_projects').getFullList(200, {
                        filter: `id in (${data.related_projects.map(p => p.id).join(',')})`,
                    });
                    setRelatedProjects(projectDetails || []);
                }

                if (data.related_models && data.related_models.length > 0) {
                    const modelDetails = await pb.collection('models').getFullList(200, {
                        filter: `id in (${data.related_models.map(m => m.id).join(',')})`,
                    });
                    setRelatedModels(modelDetails || []);
                }

                setRelatedPublications(data.related_publications || []);
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
        setProject,
        setRelatedProjects,
        setRelatedModels,
        setRelatedPublications,
    };
};

export default useProject;
