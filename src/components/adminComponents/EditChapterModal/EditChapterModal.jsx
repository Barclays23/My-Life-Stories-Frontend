// import React, { useState } from "react";
// import "./EditChapterModal.css";




// const EditChapterModal = ({ bookData, editChapter, maxNumber, onSave, onClose }) => {
//    const [title, setTitle]     = useState(editChapter.chapterTitle);
//    const [number, setNumber]   = useState(editChapter.chapterNumber);
//    const [error, setError]         = useState("");

//    const submit = () => {
//       if (!title.trim()) return setError("Title required");
//       if (number < 1 || number > maxNumber)
//          return setError(`Number must be 1–${maxNumber}`);
//       onSave({ title: title.trim(), number });
//    };

//    return (
//       <div className="modal-overlay">
//          <div className="modal-container">
//             <div className="edit-chapter-card p-4 border rounded shadow max-w-xl w-full">
//                <div className="text-center mb-4 mt-2">
//                   <h1 className="text-xl sm:text-1xl md:text-2xl font-bold">{bookData.title}</h1>
//                   <h2 className="text-base sm:text-lg text-gray-400">Edit Chapter</h2>
//                   <hr className='mt-2'/>
//                </div>

//                <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
//                   <div className="w-[15%] min-w-[80px]">
//                      <label className="block font-medium text-sm sm:text-base">No</label>
//                      <input
//                         type="number"
//                         value={number}
//                         onChange={(e) => setNumber(+e.target.value)}
//                         className="input text-center w-full text-sm sm:text-base"
//                      />
//                   </div>
//                   <div className="w-full">
//                      <label className="block font-medium text-sm sm:text-base">Chapter Title</label>
//                      <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className="input w-full text-sm sm:text-base"
//                      />
//                   </div>
//                </div>
//                {error && (
//                   <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>
//                )}

//                <div className="mt-4 flex justify-end gap-4">
//                   <button
//                      className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded text-sm sm:text-base"
//                      onClick={onClose}>
//                      Cancel
//                   </button>
//                   <button
//                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm sm:text-base"
//                      onClick={submit}>
//                      Save
//                   </button>
//                </div>
//             </div>
//          </div>
//       </div>
//    );

// };

// export default EditChapterModal;




// src/components/adminComponents/EditChapterModal/EditChapterModal.jsx
import React, { useState } from 'react';
import './EditChapterModal.css';

const EditChapterModal = ({ bookData, editChapter, maxNumber, onSave, onClose }) => {
  const [title, setTitle] = useState(editChapter.chapterTitle);
  const [number, setNumber] = useState(editChapter.chapterNumber);
  const [error, setError] = useState('');

  const submit = () => {
    if (!title.trim()) return setError('Title required');
    if (number < 1 || number > maxNumber)
      return setError(`Number must be 1–${maxNumber}`);
    onSave({ title: title.trim(), number });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="edit-chapter-card p-4 border rounded shadow max-w-xl w-full">
          <div className="text-center mb-4 mt-2">
            <h1 className="text-xl sm:text-1xl md:text-2xl font-bold">{bookData.title}</h1>
            <h2 className="text-base sm:text-lg text-gray-400">Edit Chapter</h2>
            <hr className="mt-2" />
          </div>

          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
            <div className="w-[15%] min-w-[80px]">
              <label className="block font-medium text-sm sm:text-base">No</label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(+e.target.value)}
                className="input text-center w-full text-sm sm:text-base"
              />
            </div>
            <div className="w-full">
              <label className="block font-medium text-sm sm:text-base">Chapter Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full text-sm sm:text-base"
              />
            </div>
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
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm sm:text-base"
              onClick={submit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditChapterModal;
