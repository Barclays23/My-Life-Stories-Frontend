import React from 'react';

const Moment = ({ moment, isAdmin, onDelete, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-accent-color rounded-lg p-6 relative">
      <h3 className="text-xl font-bold text-primary-color mb-2">
        Moment {moment.momentNumber}: {moment.momentTitle}
      </h3>
      <p className="text-gray-700 dark:text-gray-300">{moment.content}</p>
      {isAdmin && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button onClick={onEdit} className="btn bg-yellow-600 text-white px-2 py-1 rounded">
            Edit
          </button>
          <button onClick={onDelete} className="btn bg-red-600 text-white px-2 py-1 rounded">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Moment;