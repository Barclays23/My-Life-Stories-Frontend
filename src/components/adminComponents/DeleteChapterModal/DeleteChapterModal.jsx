// src/components/adminComponents/DeleteChapterModal/DeleteChapterModal.jsx
import React, { useState } from 'react';
import './DeleteChapterModal.css';



const DeleteChapterModal = ({ bookData, chapterData, onConfirm, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    onConfirm(chapterData.id, password);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="delete-chapter-card p-4 border rounded shadow max-w-md w-full">
          <div className="text-center mb-4 mt-2">
            <h2 className="text-xl font-bold">Delete Chapter {chapterData.chapterNumber}</h2>
            <p className="text-base text-gray-400">
              Delete "{chapterData.chapterTitle}" from "{bookData.title}"?
            </p>
            <hr className="mt-2" />
          </div>

          <div className="w-full">
            <label className="block font-medium text-sm sm:text-base">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full text-sm sm:text-base"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}

          <div className="mt-4 flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded text-sm sm:text-base"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm sm:text-base"
              onClick={handleSubmit}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChapterModal;