// src/components/admin/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineBell,
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlinePhotograph,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi';

const links = [
  { name: 'Dashboard',   to: '/admin',         icon: <HiOutlineViewGrid /> },
  { name: 'Notifications', to: '/admin/notifications', icon: <HiOutlineBell /> },
  { name: 'Heroes',      to: '/admin/heroes',  icon: <HiOutlinePhotograph /> },
  { name: 'Books',       to: '/admin/books',   icon: <HiOutlineBookOpen /> },
  { name: 'Users',       to: '/admin/users',   icon: <HiOutlineUsers /> },
  { name: 'Payments',    to: '/admin/payments',icon: <HiOutlineCurrencyDollar /> },
];

const Sidebar = ({ isOpen, toggle }) => (
  <>
    {/* dark overlay when sidebar is open (mobile only) */}
    <div
      onClick={toggle}
      className={`fixed inset-0 md:hidden transition-opacity ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    />

    <aside
      className={`sidebar bg-slate-100 dark:bg-gray-800 fixed z-40 inset-y-0 left-0 w-64]
                  transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                  transition-transform duration-200 flex flex-col`}
    >
      <div className="h-16 flex items-center justify-center text-[var(--primary-color)] font-extrabold text-xl tracking-wide border-b border-[var(--accent-color)]/80">
        Admin
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map(({ name, to, icon }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-semibold
               hover:bg-[var(--primary-color)]/10 transition
               ${isActive ? 'bg-[var(--primary-color)] text-white' : ''}`
            }
            onClick={toggle}
          >
            <span className="text-lg">{icon}</span>
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);

export default Sidebar;
