// src/pages/admin/Heroes.jsx
import React, { useEffect, useState } from 'react';
// import apiCalls from '../../utils/api';
import apiCalls from "../../../utils/api";

import { HiPencil, HiTrash } from 'react-icons/hi';

const Heroes = () => {
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    apiCalls.getAdminHeroes().then(res => setHeroes(res.data || []));
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Heroes</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-[var(--accent-color)]/20">
          <thead>
            <tr className="bg-[var(--secondary-color)] text-[var(--accent-color)] text-sm">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {heroes.map(h => (
              <tr key={h.id} className="border-t border-[var(--accent-color)]/20">
                <td className="px-4 py-2">
                  <img src={h.image} alt={h.title} className="w-28 h-16 object-cover rounded" />
                </td>
                <td className="px-4 py-2">{h.title}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="hover:text-[var(--primary-color)]"><HiPencil /></button>
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

export default Heroes;
