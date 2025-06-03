import React, { useState, useEffect } from 'react';
import './PublishBookModal.css';




const PublishBookModal = ({ bookTitle, existingPublishDate, onClose, onPublish }) => {
   const [publishDate, setPublishDate] = useState(existingPublishDate || '');

   // Format existing date to YYYY-MM-DD for input[type=date]
   useEffect(() => {
      if (existingPublishDate) {
         const date = new Date(existingPublishDate);
         const formattedDate = date.toISOString().split('T')[0]; // e.g., "2025-05-24"
         setPublishDate(formattedDate);
      }
   }, [existingPublishDate]);

   const handleSubmit = () => {
      if (!publishDate) {
         alert('Please select a publication date.');
         return;
      }
      onPublish(publishDate);
      onClose();
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
         />
         <div className="modal-actions">
            <button onClick={onClose} className="cancel-button">
               Cancel
            </button>
            <button
               onClick={handleSubmit}
               className="publish-button"
               disabled={!publishDate}
            >
               Publish
            </button>
         </div>
         </div>
      </div>
   );
};

export default PublishBookModal;