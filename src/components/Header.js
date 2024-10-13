import React from 'react';

const Header = () => {
  return (
    <header className='h-[10vh] w-full flex items-center px-5 bg-white shadow-md' style={{ position: 'sticky', top: 0, zIndex: 10 }}>
      <a href='/profile-form'>
        <img src='/assets/ajmera-info.svg' alt='logo' className='w-40 h-30' />
      </a>
    </header>
  );
};

export default Header;
