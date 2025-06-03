import React, { useState } from 'react';
import apiCalls from '../../../utils/api';
import './DeleteBookModal.css';
import { toast } from 'react-toastify';
import { firebaseErrorMap } from '../../../firebase/firebaseErrorMap';




const DeleteBookModal = ({ bookId, bookTitle, close, onDeleted }) => {
   const [password, setPassword] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState('');

   const handleDelete = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');

      try {
         const res = await apiCalls.deleteBook(bookId, password);
         // console.log('res after delete :', res);
         onDeleted?.();     // parent can refresh list / redirect
         toast.success(`The book "${res.bookData.title}" has been deleted successfully!`);
         close();
      } catch (error) {
         console.log('Error in deleteBook:', error?.response?.data?.message || error?.response?.data?.error || error?.message);
         const errorMessage =
            error?.response?.data?.message ||                       // For Axios or HTTP-based errors
            firebaseErrorMap.get(error?.code) ||                   // For Firebase-specific errors
            error?.message ||                                      // Generic JS or Firebase fallback
            "An unexpected error occurred.";                       // Final fallback
         setError(errorMessage);
         toast.error(errorMessage);

      } finally {
         setSubmitting(false);
      }
   };



   return (
      <div className="modal-overlay">
         <div className="modal-card">
            <h2>Delete “{bookTitle}”?</h2>
            <p className="mt-2 text-sm text-gray-500">
               This action is irreversible. Please confirm your admin password.
            </p>

            <form onSubmit={handleDelete} className="mt-4 flex flex-col gap-3">
               <input
                  type="password"
                  className="input"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
               {error && <p className="text-red-600 text-sm">{error}</p>}
               
               <div className="flex gap-3 justify-end">
                  <button type="button" onClick={close} className="cancel-btn">
                     Cancel
                  </button>
                  <button
                     type="submit"
                     disabled={submitting}
                     className="delete-btn"
                     >
                     {submitting ? 'Deleting…' : 'Delete'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default DeleteBookModal;
