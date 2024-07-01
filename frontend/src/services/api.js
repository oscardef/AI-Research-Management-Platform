import axios from 'axios';
import { supabase } from './supabaseClient';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export default api;
