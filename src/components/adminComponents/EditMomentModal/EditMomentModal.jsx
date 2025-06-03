import React, { useState, useEffect, useRef } from "react";
import './EditMomentModal.css';




const EditMomentModal = ({ isOpen, onClose, onEdit, initialData, bookData, chapterData }) => {
   const [momentTitle, setMomentTitle] = useState("");
   const [momentContent, setMomentContent] = useState("");
   const [momentImage, setMomentImage] = useState("");
   const [momentNumber, setMomentNumber] = useState(1);
   const [isVisible, setIsVisible] = useState(true);
   const [previewImage, setPreviewImage] = useState(null);
   const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
   const [errors, setErrors] = useState({});
   
   const fileInputRef = useRef(null);


   /* ─────────────────────────── image preview logic ───────────── */
   useEffect(() => {
      if (!momentImage) {
         setPreviewImage(null);
         return;
      }
      
      if (typeof momentImage === 'string') {
         setPreviewImage(momentImage);
         return;
      }

      const objectUrl = URL.createObjectURL(momentImage);
      setPreviewImage(objectUrl);

      // free memory when component unmounts OR when a new file is picked
      return () => {
         if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
   }, [momentImage]);


   /* ─────────────────────────────── reset when modal closes ───────── */
   useEffect(() => {
      if (initialData) {
         setMomentTitle(initialData.momentTitle || "");
         setMomentContent(initialData.momentContent || "");
         setMomentImage(initialData.momentImage || null);
         setMomentNumber(initialData.momentNumber || 1);
         setShouldRemoveImage(false); // Reset removal flag
         setIsVisible(initialData.isVisible ?? true);
      }
   }, [initialData, isOpen]);


   /* ─────────────────────────────── remove image ────────────────────────── */
   const removeImage = () => {
      setMomentImage(null);
      setPreviewImage(null);
      setShouldRemoveImage(true);  // to remove it from storage

      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };


   /* ─────────────────────────────── form validation ────────────────────────── */
   const validateForm = () => {
      const newErrs = {};

      /* ── moment title ─────────────────── */
      const trimmedTitle = momentTitle.trim();
      if (!trimmedTitle) newErrs.momentTitle = "Title is required.";
      else if (trimmedTitle.length < 3) newErrs.momentTitle = "Title must be at least 3 chars.";
      else if (trimmedTitle.length > 50) newErrs.momentTitle = "Title can't exceed 50 chars.";

      /* ── moment content ─────────────────── */
      const trimmedContent = momentContent.trim();
      if (!trimmedContent) newErrs.momentContent = "Content is required.";
      else if (trimmedContent.length < 200) newErrs.momentContent = "Please write a more detailed story (minimum 250 characters).";

      /* ── image (optional) ────────── */
      if (momentImage && typeof momentImage !== 'string') {
         const { size, type } = momentImage;
         const mb = size / (1024 * 1024);
         if (!/^image\/(jpeg|png|webp)$/i.test(type)){
            newErrs.momentImage = "JPEG / PNG / WEBP only.";
         }
         else if (mb > 2){
            newErrs.momentImage = "Image size must be less that 2 MB.";
         }
      }

      setErrors(newErrs);
      return Object.keys(newErrs).length === 0;   // ✅ / ❌
   };

   const clearErr = (field) => setErrors(prev => ({ ...prev, [field]: null }));



   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const editedMoment = {
         momentId: initialData.id,
         momentNumber: Number(momentNumber),
         momentTitle: momentTitle.trim(),
         momentContent: momentContent.trim(),
         momentImage: typeof momentImage === 'string' ? momentImage : momentImage, // Keep existing URL or new file
         shouldRemoveImage,  // should remove the momentImage or not
         isVisible
      };

      /* WAIT for the parent to finish; parent will close modal on success */
      await onEdit(editedMoment);
      setShouldRemoveImage(false);  // Reset image removal state for next time
   };

   if (!isOpen) return null;



   return (
      <div className="modal-overlay fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 px-2">
         <div className="edit-moment-modal-container bg-slate-100 rounded shadow-md p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h1 className="text-lg sm:text-xl font-bold text-center mb-1">{bookData?.title}</h1>
            <h3 className="headings text-sm sm:text-base text-center text-gray-700 mb-2">
               Chapter {chapterData?.chapterNumber} - {chapterData?.chapterTitle}
            </h3>
            <h2 className="headings text-base sm:text-lg font-semibold text-center mb-4 text-gray-700 border-b pb-1">
               Edit Moment
            </h2>

            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
               {/* Moment Number */}
               <div className="w-[15%] min-w-[80px]">
                  <label className="block font-medium text-sm sm:text-base">No</label>
                  <input
                     type="number"
                     value={momentNumber}
                     onChange={(e) => {
                        setMomentNumber(e.target.value);
                        clearErr("momentNumber");
                     }}
                     min={1}
                     className="rounded border border-gray-500 px-2 py-2 text-center w-full text-sm sm:text-base"
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
                        clearErr("momentTitle");
                     }}
                     className="w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500" 
                  />
               </div>
            </div>
            {errors.momentTitle && <p className="text-red-600 text-sm mt-1">{errors.momentTitle}</p>}

            {/* Moment Content */}
            <div className="flex flex-col my-3">
               <label className="block font-medium text-sm sm:text-base">Moment Story</label>
               <textarea
                  placeholder="Moment Content"
                  value={momentContent}
                  onChange={e => {
                     setMomentContent(e.target.value);
                     clearErr("momentContent");
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
                  id="editMomentImageInput"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                     if (e.target.files?.[0]) {
                        setMomentImage(e.target.files[0]);
                        setPreviewImage(URL.createObjectURL(e.target.files[0]));
                        // setShouldRemoveImage(false);
                        clearErr("momentImage");
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
                     htmlFor="editMomentImageInput"
                     className="bg-blue-600 text-white px-4 py-2 rounded 
                              cursor-pointer hover:bg-blue-700 text-sm">
                     {momentImage ? "Change Image" : "Upload Image"}
                  </label>
               </div>
            </div>

            {/* Visibility Toggle */}
            <label className="flex items-center gap-2 mb-4">
               <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
               />
               <span className="text-sm sm:text-base">Visible to readers</span>
            </label>

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
                  Save Changes
               </button>
            </div>
         </div>
      </div>
   );

};

export default EditMomentModal;
