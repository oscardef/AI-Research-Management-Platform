// src/context/ModelContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
  const [models, setModels] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchModels = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .contains('collaborators', [user.id]);

        if (error) {
          console.error('Error fetching models:', error);
        } else {
          setModels(data);
        }
      }
    };

    fetchModels();
  }, [user]);

  return (
    <ModelContext.Provider value={{ models, setModels }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModels = () => useContext(ModelContext);
