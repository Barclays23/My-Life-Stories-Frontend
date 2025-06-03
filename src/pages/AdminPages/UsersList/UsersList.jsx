import React, { useEffect, useState } from 'react';
// import apiCalls from '../../utils/api';
import apiCalls from "../../../utils/api";

import { HiLockClosed, HiLockOpen } from 'react-icons/hi';



const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiCalls.getAdminUsers().then(res => setUsers(res.data || []));
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-[var(--accent-color)]/20">
          <thead>
            <tr className="bg-[var(--secondary-color)] text-[var(--accent-color)] text-sm">
              <th className="px-4 py-2">Photo</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Mobile</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-[var(--accent-color)]/20">
                <td className="px-4 py-2">
                  <img src={u.photoURL || '/assets/images/default-story.jpg'} alt="" className="w-10 h-10 rounded-full" />
                </td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.mobile}</td>
                <td className="px-4 py-2 text-center">
                  {u.isBlocked ? (
                    <button className="flex items-center gap-1 hover:text-[var(--primary-color)]"><HiLockOpen /> Unblock</button>
                  ) : (
                    <button className="flex items-center gap-1 hover:text-[var(--primary-color)]"><HiLockClosed /> Block</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default UsersList;
