// src/components/adminComponents/ChapterList/ChapterList.jsx
import React from 'react';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import './ChapterList.css';

const ChapterList = ({ bookId, chapters = [], onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="chapter-list w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-2">Chapters List</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-600">
        <thead className="table-head">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Chapter Title</th>
            <th className="px-4 py-2">Moments</th>
            <th className="px-4 py-2">Published</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {chapters.length ? (
            chapters.map((chapter) => (
              <tr
                key={chapter.id}
                onClick={() => navigate(`/admin/books/${bookId}/${chapter.chapterNumber}`)}
                className="table-body-row cursor-pointer text-center border border-gray-600"
              >
                <td className="px-4 py-2">{chapter.chapterNumber}</td>
                <td className="px-4 py-2">{chapter.chapterTitle}</td>
                <td className="px-4 py-2">{chapter.momentCount || 0}</td>
                <td className="px-4 py-2">{chapter.isPublished ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 actions flex justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(chapter);
                    }}
                  >
                    <HiPencil />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(chapter);
                    }}
                  >
                    <HiTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-red-500 text-center">
                No chapters available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChapterList;