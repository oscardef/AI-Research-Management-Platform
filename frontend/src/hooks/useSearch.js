// hooks/useSearch.js
import { useState } from 'react';
import { pb } from '../services/pocketbaseClient';

const useSearch = (type) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let results = [];
      if (type === 'related_projects') {
        results = await pb.collection('research_projects').getFullList({
          filter: `title ~ '${searchTerm}'`,
        });
      } else if (type === 'related_models') {
        results = await pb.collection('models').getFullList({
          filter: `name ~ '${searchTerm}'`,
        });
      } else if (type === 'collaborators') {
        results = await pb.collection('users').getFullList({
          filter: `name ~ '${searchTerm}'`,
        });
      } else if (type === 'related_publications') {
        const response = await fetch(`https://api.crossref.org/works?query=${searchTerm}&rows=10`);
        const data = await response.json();
        results = data.message.items.map(item => ({
          title: item.title[0],
          author: item.author ? item.author.map(a => a.family).join(', ') : 'Unknown Author',
          journal: item['container-title'] ? item['container-title'][0] : 'Unknown Journal',
          url: item.URL
        }));
      }
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    }
    setLoading(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    loading,
    handleSearch,
  };
};

export default useSearch;
