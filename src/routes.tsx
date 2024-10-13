import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AddProfile from './views/AddProfile';
import Dashboard from './views/profile';
import NotFoundPage from './views/NotFoundPage';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/profile', { replace: true });
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path='/profile-form' element={<AddProfile />} />
      <Route path='/profile' element={<Dashboard />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
