// src/pages/admin/Notifications.jsx
import React, { useEffect, useState } from 'react';
// import apiCalls from '../../utils/api';
import apiCalls from "../../../utils/api";
import { HiTrash } from 'react-icons/hi';

const NotificationsList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    apiCalls.getAdminNotifications().then(res => setNotes(res.data || []));
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-[var(--accent-color)]/20">
          <thead>
            <tr className="bg-[var(--secondary-color)] text-[var(--accent-color)] text-sm">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(n => (
              <tr key={n.id} className="border-t border-[var(--accent-color)]/20">
                <td className="px-4 py-2">{new Date(n.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{n.message}</td>
                <td className="px-4 py-2">
                  <button className="hover:text-[var(--primary-color)]"><HiTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default NotificationsList;
