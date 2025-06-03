import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import './AddMomentModal.css';



const AddMomentModal = ({ isOpen, onClose, onAdd, bookData, chapterData }) => {
   const [momentTitle, setMomentTitle] = useState("");
   const [momentContent, setMomentContent] = useState("");
   const [momentImage, setMomentImage] = useState(null);
   const [previewImage, setPreviewImage] = useState(null);
   const [errors, setErrors] = useState({});


   const existingMomentCount = chapterData.momentCount;   
   const nextMomentNumber = existingMomentCount + 1;  // ONLY TO SHOW IN ADD MOMENT FORM
   // console.log('existingMomentCount :', existingMomentCount, 'nextMomentNumber :', nextMomentNumber);
   
   const fileInputRef = useRef(null);


   const removeImage = () => {
      setMomentImage(null);
      setPreviewImage(null);
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };


   /* ─────────────────────────── image preview logic ───────────── */
   useEffect(() => {
      if (!momentImage) {
         setPreviewImage(null);
         return;
      }
      const objectUrl = URL.createObjectURL(momentImage);
      setPreviewImage(objectUrl);

      // free memory when component unmounts OR when a new file is picked
      return () => URL.revokeObjectURL(objectUrl);
   }, [momentImage]);


   /* ─────────────────────────────── reset when modal closes ───────── */
   useEffect(() => {
      if (!isOpen) {
         setMomentTitle("");
         setMomentContent("");
         setMomentImage(null);
         setPreviewImage(null);
         setErrors({});
         if (fileInputRef.current) fileInputRef.current.value = "";
      }
   }, [isOpen]);



   /* ─────────────────────────────── form validation ────────────────────────── */
   const validateForm = () => {
      const newErrs = {};

      /* ── moment title ─────────────────── */
      const trimmedTitle = momentTitle.trim();
      if (!trimmedTitle) newErrs.momentTitle = "Title is required.";
      else if (trimmedTitle.length < 3) newErrs.momentTitle = "Title must be at least 3 chars.";
      else if (trimmedTitle.length > 50) newErrs.momentTitle = "Title can’t exceed 50 chars.";

      /* ── moment content ─────────────────── */
      const trimmedContent = momentContent.trim();
      if (!trimmedContent) newErrs.momentContent = "Content is required.";
      else if (trimmedContent.length < 200) newErrs.momentContent = "Please write a more detailed story (minimum 250 characters).";

      /* ── image (optional) ────────── */
      if (momentImage) {
         const { size, type } = momentImage;
         const mb = size / (1024 * 1024);
         if (!/^image\/(jpeg|png|webp)$/i.test(type)){
            newErrs.momentImage = "JPEG / PNG / WEBP only.";
         }
         else if (mb > 2){
            newErrs.momentImage = "Image must be ≤ 2 MB.";
         }
      }

      setErrors(newErrs);
      return Object.keys(newErrs).length === 0;   // ✅ / ❌
   };

   const clearErr = (field, setErrors) => setErrors(prev => ({ ...prev, [field]: null }));

   /* ─────────────────────────────── form submit ────────────────────────── */
   const handleSubmit = async (e) => {      
      e.preventDefault();
      if (!validateForm()) return;


      const newMoment = {
         // momentNumber : nextMomentNumber,  // No need to send the moment number from frontend (will generate from backend)
         momentTitle: momentTitle.trim(),
         momentContent: momentContent.trim(),
         momentImage,
      };

      /* WAIT for the parent to finish; parent will close modal on success */
      await onAdd(newMoment);
   };



   if (!isOpen) return null;

   return (
      <div className="modal-overlay fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 px-2">
         <div className="add-moment-modal-container bg-slate-100 rounded shadow-md p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h1 className="text-lg sm:text-xl font-bold text-center mb-1">{bookData?.title}</h1>
            <h3 className="headings text-sm sm:text-base text-center text-gray-700 mb-2">
            Chapter {chapterData?.chapterNumber} - {chapterData?.chapterTitle}
            </h3>
            <h2 className="headings text-base sm:text-lg font-semibold text-center mb-4 text-gray-700 border-b pb-1">
            Add Moment
            </h2>

            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
               {/* Moment Number */}
               <div className="w-[15%] min-w-[80px]">
                  <label className="block font-medium text-sm sm:text-base">No</label>
                  <input
                     type="number"
                     value={nextMomentNumber}
                     readOnly
                     // className="w-[15%] border border-gray-500 px-2 py-2 rounded cursor-not-allowed text-sm sm:text-base"
                     className="rounded border border-gray-500 px-2 py-2 text-center cursor-not-allowed w-full text-sm sm:text-base"
                  />
               </div>

               {/* Moment Title */}
               <div className="w-full">
                  <label className="block font-medium text-sm sm:text-base">Moment Title</label>
                  <input
                     type="text"
                     placeholder="Moment Title"
                     value={momentTitle}
                     onChange={e => {
                     setMomentTitle(e.target.value);
                     clearErr("momentTitle", setErrors);
                     }}
                     className="w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500" 
                  />
               </div>
            </div>
            {errors.momentTitle &&  <p className="text-red-600 text-sm mt-1">{errors.momentTitle}</p>}


            {/* Moment Content */}
            <div className="flex flex-col my-3">
               <label className="block font-medium text-sm sm:text-base">Moment Story</label>
               <textarea
                  placeholder="Moment Content"
                  value={momentContent}
                  onChange={e => {
                     setMomentContent(e.target.value);
                     clearErr("momentContent", setErrors);
                  }}
                  className="w-full border border-gray-500 px-3 py-2 rounded text-sm sm:text-base"
                  rows={5}
               />
               {errors.momentContent && (
                  <p className="text-red-600 text-sm mt-1">{errors.momentContent}</p>
               )}
            </div>

            {/* ░░░ IMAGE PICKER + PREVIEW ░░░ */}
            <div className="flex flex-wrap items-end gap-4 mt-1 mb-5">
               {/* Hidden File Input */}
               <input
                  ref={fileInputRef}
                  id="momentImageInput"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                     if (e.target.files?.[0]) {
                     setMomentImage(e.target.files[0]);
                     setPreviewImage(URL.createObjectURL(e.target.files[0]));
                     setErrors(prev => ({ ...prev, momentImage: null }));
                     }
                  }}
                  className="hidden"
               />

            {/* Image Preview with Remove Button */}
            {previewImage && (
               <div className="relative w-[120px] h-[120px] rounded overflow-hidden shadow-sm shadow-slate-400">
                  <img
                     src={previewImage}
                     alt="moment preview"
                     className="w-full h-full object-cover"
                     />
                  <button
                     type="button"
                     onClick={removeImage}
                     className="absolute -top-1 -right-1 bg-red-600 text-white 
                     w-6 h-6 rounded-full flex items-center justify-center text-sm 
                                 hover:bg-red-700 shadow"
                                 title="Remove image" >
                     x
                  </button>
               </div>
            )}

               {/* Upload Button aligned to bottom of image */}
               <div className="flex flex-col justify-end">
            {errors.momentImage && (
               <p className="text-red-600 text-sm mt-1">{errors.momentImage}</p>
            )}
                  <label
                     htmlFor="momentImageInput"
                     className="bg-blue-600 text-white px-4 py-2 rounded 
                              cursor-pointer hover:bg-blue-700 text-sm">
                     {momentImage ? "Change Image" : "Upload Image"}
                  </label>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
               <button
                  className="cancel-btn px-4 py-2 rounded text-sm sm:text-base"
                  onClick={onClose} >
                  Cancel
               </button>
               <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm sm:text-base"
                  onClick={handleSubmit}>
                  Add Moment
               </button>
            </div>
         </div>
      </div>
   );

};

export default AddMomentModal;
