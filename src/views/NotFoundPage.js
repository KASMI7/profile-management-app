import React from 'react';

const NotFoundPage = () => {
  return (
    <div className='not-found-container'>
      <img
        src='/images/404-image.png' // Make sure this image exists in your public folder
        alt='404 - Page Not Found'
        className='not-found-image'
      />
      <h1 className='not-found-text'>Page Not Found</h1>
    </div>
  );
};

export default NotFoundPage;
