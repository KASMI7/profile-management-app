import React from 'react';

interface Profile {
  id: string;
  name: string;
  email: string;
  age?: number;
}

interface HeaderProps {
  lastUser: Profile | null;
}

const Header: React.FC<HeaderProps> = ({ lastUser }) => {
  return (
    <header className='h-[10vh] w-full flex items-center justify-between px-5 bg-white shadow-md' style={{ position: 'sticky', top: 0, zIndex: 10 }}>
      <a href='/profile-form'>
        <img src='/assets/ajmera-info.svg' alt='logo' className='w-40 h-30' />
      </a>
      {lastUser && (
        <div className='text-sm text-gray-600'>
          <p>Last User: {lastUser.name} ({lastUser.email})</p>
        </div>
      )}
    </header>
  );
};

export default Header;
