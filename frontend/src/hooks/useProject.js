// useProject.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [relatedModels, setRelatedModels] = useState([]);
  const [relatedPublications, setRelatedPublications] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('research_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
      } else {
        setProject({
          ...data,
          related_projects: data.related_projects || [],
          related_models: data.related_models || [],
          related_publications: data.related_publications || []
        });
        if (data.related_projects && data.related_projects.length > 0) {
          const projectDetails = await supabase
            .from('research_projects')
            .select('id, title, description')
            .in('id', data.related_projects);
          setRelatedProjects(projectDetails.data || []);
        }
        if (data.related_models && data.related_models.length > 0) {
          const modelDetails = await supabase
            .from('models')
            .select('id, name, description')
            .in('id', data.related_models);
          setRelatedModels(modelDetails.data || []);
        }
        setRelatedPublications(data.related_publications || []);
      }
      setLoading(false);
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
