import React from "react";
import { useState } from "react";
import './DeleteMomentModal.css';


const DeleteMomentModal = ({ isOpen, onClose, onDelete, selectedMoment }) => {
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   if (!isOpen) return null;


   const handleConfirmationForm = () => {
      if (!password.trim()) {
         setError('Password is required');
         return;
      }
      // Pass both the moment data & password to the parent
      onDelete(selectedMoment, password);
   };
   


   return (
      <div className="modal-overlay">
         <div className="modal-container">
            <div className="delete-moment-card p-4 border rounded shadow max-w-md w-full">
               <div className="text-center mb-4 mt-2">
                  <h2 className="text-xl font-bold">Delete Moment - {selectedMoment.momentNumber}</h2>
                  <p className="text-base text-gray-400">
                     Delete <span className="font-extrabold text-gray-200">'{selectedMoment.momentTitle}'</span> from Chapter?
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
                     onClick={onClose} >
                     Cancel
                  </button>
                  <button
                     className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm sm:text-base"
                     onClick={handleConfirmationForm} >
                     Confirm Delete
                  </button>
               </div>
            </div>
         </div>
      </div>
   );

  
};

export default DeleteMomentModal;
