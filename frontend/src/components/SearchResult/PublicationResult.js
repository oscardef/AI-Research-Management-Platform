// PublicationResult.js

import React from 'react';
import SearchResult from './SearchResult';

/**
 * PublicationResult Component
 * 
 * This component is a wrapper around the generic SearchResult component.
 * It specifically formats and displays information about a publication,
 * including the title, author, journal, and a link to the publication.
 * 
 * @param {Object} props - The component props
 * @param {Object} props.publication - The publication object containing details about the publication
 * @returns {JSX.Element} The rendered component
 */
const PublicationResult = ({ publication }) => {
  return (
    <SearchResult
      title={publication.title}
      subtitle={`${publication.author} - ${publication.journal}`}
      link={publication.url}
      isExternal={true}
    />
  );
};

export default PublicationResult;
