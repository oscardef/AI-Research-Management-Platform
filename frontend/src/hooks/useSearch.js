// Importing the useState hook from React for managing local state
import { useState } from 'react';

// Importing the PocketBase client for API interactions
import { pb } from '../services/pocketbaseClient';

/**
 * Custom React hook to handle search functionality across different data types.
 *
 * @param {string} type - The type of data to search (e.g., 'related_projects', 'related_models', etc.).
 * @returns {object} An object containing search term, search results, loading state, and relevant handlers.
 */
const useSearch = (type) => {
  // State to manage the current search term entered by the user
  const [searchTerm, setSearchTerm] = useState('');

  // State to hold the search results
  const [searchResults, setSearchResults] = useState([]);

  // State to indicate if the search is currently being executed
  const [loading, setLoading] = useState(false);

  /**
   * Function to handle the search operation based on the provided type.
   * It fetches data from different sources depending on the type.
   */
  const handleSearch = async () => {
    // Set loading state to true to indicate that the search is in progress
    setLoading(true);
    try {
      let results = [];
      
      // Determine the search type and perform the appropriate query
      if (type === 'related_projects') {
        // Fetch projects where the title matches the search term
        results = await pb.collection('research_projects').getFullList({
          filter: `title ~ '${searchTerm}'`,
        });
      } else if (type === 'related_models') {
        // Fetch models where the name matches the search term
        results = await pb.collection('models').getFullList({
          filter: `name ~ '${searchTerm}'`,
        });
      } else if (type === 'collaborators') {
        // Fetch users where the name matches the search term
        results = await pb.collection('users').getFullList({
          filter: `name ~ '${searchTerm}'`,
        });
      } else if (type === 'related_publications') {
        // Fetch publications using the CrossRef API where the title matches the search term
        const response = await fetch(`https://api.crossref.org/works?query=${searchTerm}&rows=10`);
        const data = await response.json();
        // Map the response data to a simplified format
        results = data.message.items.map(item => ({
          title: item.title[0],
          author: item.author ? item.author.map(a => a.family).join(', ') : 'Unknown Author',
          journal: item['container-title'] ? item['container-title'][0] : 'Unknown Journal',
          url: item.URL
        }));
      }

      // Set the fetched results to the state
      setSearchResults(results);
    } catch (error) {
      // Log any errors that occur during the search
      console.error('Error searching:', error);
    }

    // Set loading state to false, indicating the search has completed
    setLoading(false);
  };

  // Return the state and handler functions to the component using this hook
  return {
    searchTerm, // The current search term entered by the user
    setSearchTerm, // Function to update the search term
    searchResults, // The search results
    setSearchResults, // Function to update the search results
    loading, // The loading state indicating if a search is in progress
    handleSearch, // Function to initiate the search based on the current search term
  };
};

export default useSearch;
