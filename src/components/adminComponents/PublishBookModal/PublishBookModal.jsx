import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { firebaseErrorMap } from '../../../firebase/firebaseErrorMap';
import apiCalls from '../../../utils/api';
import './PublishBookModal.css';




const PublishBookModal = ({bookId, bookTitle, existingPublishDate, onClose, onSuccess}) => {
   const [publishDate, setPublishDate] = useState('');
   const [isLoading, setIsLoading] = useState(false);


   useEffect(() => {
      if (existingPublishDate) {
         const date = new Date(existingPublishDate);
         const formattedDate = date.toISOString().split('T')[0];
         setPublishDate(formattedDate);
      }
   }, [existingPublishDate]);



   const handlePublish = async () => {
      if (!publishDate) {
         toast.error('Please select a publication date.');
         return;
      }

      try {
         setIsLoading(true);
         await apiCalls.togglePublishBook(bookId, true, publishDate);
         toast.success("It's official — your book is now live!");
         onSuccess();
         onClose();

      } catch (error) {
         const message = firebaseErrorMap.get(error?.code) ?? 'Failed to publish book. Please try again.';
         toast.error(message);

      } finally {
         setIsLoading(false);
      }
   };





   return (
      <div className="modal-overlay">
         <div className="modal-content">
         <h2>Publish "{bookTitle}"</h2>
         <p className='text-sm'>Please select the publication date:</p>
         <input
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            className="date-input"
            min={new Date().toISOString().split('T')[0]}
         />
         <div className="modal-actions">
            <button onClick={onClose} className="cancel-button" disabled={isLoading}>
               Cancel
            </button>
            <button
               onClick={handlePublish}
               className="publish-button"
               disabled={!publishDate || isLoading}
            >
               {isLoading ? 'Publishing...' : 'Publish'}
            </button>
         </div>
         </div>
      </div>
   );
};

export default PublishBookModal;