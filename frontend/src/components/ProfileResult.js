import React from 'react';

const ProfileResult = ({ profile }) => {
  return (
    <div>
      <h3>{`${profile.first_name} ${profile.last_name}`}</h3>
      <p>{profile.email}</p>
    </div>
  );
};

export default ProfileResult;
