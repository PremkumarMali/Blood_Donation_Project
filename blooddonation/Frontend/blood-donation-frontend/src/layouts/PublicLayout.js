import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div>
      {/* You can add a Public Navbar here later */}
      <div className="public-content" style={{ minHeight: '100vh' }}>
        <Outlet />
      </div>
      {/* You can add a Public Footer here later */}
    </div>
  );
};

export default PublicLayout;
