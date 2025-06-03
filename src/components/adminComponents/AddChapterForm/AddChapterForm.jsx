import React, { useState } from 'react';
import apiCalls from '../../../utils/api';
import './AddChapterForm.css';
import { toast } from 'react-toastify';
import { firebaseErrorMap } from '../../../firebase/firebaseErrorMap';
import LoadingSpinner2 from '../../Loading Spinner/LoadingSpinner2';




const AddChapterForm = ({ bookData, existingChapters, onClose, onChaptersUpdate, onBookUpdate }) => {
   const [title, setTitle] = useState('');
   const [titleError, setTitleError] = useState('');
   const [loading, setLoading] = useState(false)
   // const [isPublished, setIsPublished] = useState(false);

   const nextChapterNumber = existingChapters + 1;  // ONLY TO SHOW IN ADD CHAPTER FORM
   // console.log('existingChapters :', existingChapters, 'nextChapterNumber :', nextChapterNumber);

   // console.log('bookData :', bookData);
   
   
   // Validation
   const validateForm = () => {
      let isValid = true;
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
         setTitleError('Chapter title is required.');
         isValid = false;
      } else if (trimmedTitle.length < 3) {
         setTitleError('Chapter title must be at least 3 characters.');
         isValid = false;
      } else if (trimmedTitle.length > 30) {
         setTitleError('Chapter title should not exceed 30 characters.');
         isValid = false;
      } else {
         setTitleError('');
      }

      return isValid;
   };


   const handleAddChapterForm = async (e) => {   
      e.preventDefault();
      // validateForm();
      
      if (!validateForm()) return;

      
      try {
         setLoading(true)
         const res = await apiCalls.createChapter({
            bookId: bookData.id,
            chapterTitle: title.trim()
            // chapterNumber : nextChapterNumber, // No need to update the chapterCount from frontend. It's managed from backend.
            // isPublished    // no need to publish when creating.
         });
         // console.log('res in chapter creating :', res);
         toast.success(`Chapter ${res?.chapterNumber || ''}: ${res?.chapterTitle || ''} is created!`);
         setTitle('');
         setTitleError('');
         await Promise.all([onChaptersUpdate(), onBookUpdate()]); // Refresh chapters and book data
         onClose();

      } catch (error) {
         console.error('createChapter error :', error);
         // Try to get Firebase-specific error first
         const firebaseMessage = firebaseErrorMap.get(error?.code);
         // Fallback to backend response error or a generic message
         const fallbackMessage = error.response?.data?.error || 'Failed to create chapter.';
         // Final message
         const message = firebaseMessage || fallbackMessage;
         toast.error(message);
      } finally {
         setLoading(false)
      }
   };


   if (loading) return <LoadingSpinner2 />;


   return (
      <div className="modal-overlay">
         <div className="add-chapter-modal-container">
            <div className="add-chapter-card p-4 border rounded shadow max-w-xl w-full">
               <div className="text-center mb-4 mt-2">
                  <h1 className="text-xl sm:text-1xl md:text-2xl font-bold">{bookData.title}</h1>
                  <h2 className="text-base sm:text-lg text-gray-400">Add Chapter</h2>
                  <hr className='mt-2'/>
               </div>

               <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                  <div className="w-[15%] min-w-[80px]">
                     <label className="block font-medium text-sm sm:text-base">No</label>
                     <input
                        type="number"
                        value={nextChapterNumber}
                        disabled
                        className="input text-center cursor-not-allowed w-full text-sm sm:text-base"
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
               {titleError && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{titleError}</p>
               )}

               <div className="mt-4 flex justify-end gap-4">
                  <button
                     className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded text-sm sm:text-base"
                     onClick={onClose} >
                     Cancel
                  </button>
                  <button
                     className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm sm:text-base"
                     onClick={handleAddChapterForm} >
                     Add
                  </button>
               </div>
            </div>
         </div>
      </div>
   );

};

export default AddChapterForm;
