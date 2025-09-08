import React from 'react';
import SidebarAdmin from './sidebarAdmin';

function AdminLayout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f5f7fb' }}>
      <SidebarAdmin />
      <div className="flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
