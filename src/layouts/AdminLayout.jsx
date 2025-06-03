// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/adminComponents/Sidebar';
import { HiMenu } from 'react-icons/hi';

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  return (
    <div className="flex min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <Sidebar isOpen={open} toggle={toggleSidebar} />

      {/* mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md
                   bg-[var(--secondary-color)] text-[var(--accent-color)]"
      >
        <HiMenu size={24} />
      </button>

      {/* main content */}
      {/* <main className="flex-1 md:ml-48 p-4 space-y-6 transition-all duration-200"> */}
      <main className="flex-1 md:ml-48 p-4 space-y-6 overflow-x-auto transition-all duration-200">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
