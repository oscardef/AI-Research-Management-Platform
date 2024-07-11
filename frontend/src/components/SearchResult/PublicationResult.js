// PublicationResult.js
import React from 'react';
import SearchResult from './SearchResult';

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
