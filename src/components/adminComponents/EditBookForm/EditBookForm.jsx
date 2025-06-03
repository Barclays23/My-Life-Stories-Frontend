import React, { useState, useEffect, useRef } from 'react';
import apiCalls from "../../../utils/api";
import { ml2en } from '../../../utils/transliterate';
import './EditBookForm.css';
import LoadingSpinner1 from '../../Loading Spinner/LoadingSpinner1';
import { firebaseErrorMap } from '../../../firebase/firebaseErrorMap';
import { toast } from 'react-toastify';




const EditBookForm = ({ book, onClose, onBookUpdate }) => {
   const [bookTitle, setBookTitle] = useState(book.title || '');
   const [englishTitle, setEnglishTitle] = useState(book.englishTitle || '');
   const [slug, setSlug] = useState(book.slug || '');
   const [tagline, setTagline] = useState(book.tagline || '');
   const [blurb, setBlurb] = useState(book.blurb || '');
   const [coverImage, setCoverImage] = useState(null);
   const [preview, setPreview] = useState(book.coverImageUrl || null);
   const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
   const [genre, setGenre] = useState(book.genre || []);
   const [language, setLanguage] = useState(book.language || '');
   const [releaseStatus, setReleaseStatus] = useState(book.releaseStatus || 'Draft');
   const [publicationDate, setPublicationDate] = useState(book.publicationDate || '');
   const [accessType, setAccessType] = useState(book.accessType || 'Free');
   const [price, setPrice] = useState(book.price || 0);
   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);

   const fileInputRef = useRef();

   // Update slug and englishTitle when bookTitle changes
   const handleBookTitle = (value) => {
      setBookTitle(value);
      const convertedText = ml2en(value);
      const capitalizedText = convertedText.replace(/\b\w/g, c => c.toUpperCase());
      const generatedSlug = generateSlug(convertedText);
      setEnglishTitle(capitalizedText);
      setSlug(generatedSlug);
   };

   function generateSlug(text) {
      return text
         .toLowerCase()
         .trim()
         .replace(/[^\w\s-]/g, '')
         .replace(/\s+/g, '-')
         .replace(/--+/g, '-');
   }

   // Preview logic for cover image
   useEffect(() => {
      if (!coverImage) {
         setPreview(book.coverImageUrl || null);
         return;
      }
      const objectUrl = URL.createObjectURL(coverImage);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
   }, [coverImage, book.coverImageUrl]);

   const removeImage = () => {
      setCoverImage(null);
      setPreview(null);
      setShouldRemoveImage(true); // Set flag to remove image from storage
      fileInputRef.current.value = '';
      setErrors(prev => ({ ...prev, coverImage: null }));
   };

   const genreOptions = ['Memoir', 'Travel', 'Story', 'History', 'Poetry', 'Fiction', 'Non-Fiction', 'Sports', 'Romance', 'Spiritual', 'Articles'];

   const toggleGenre = (g) => {
      setGenre(prev => prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]);
   };

   const clearErr = field => setErrors(e => ({ ...e, [field]: null }));

   // Validation
   const validate = () => {
      const newErr = {};
      if (!bookTitle.trim()) newErr.bookTitle = 'Title is required';
      if (!language) newErr.language = 'Please choose a language';
      if (!englishTitle.trim()) newErr.englishTitle = 'English title is required';
      if (!tagline.trim()) newErr.tagline = 'Tagline is required';
      if (!blurb.trim()) newErr.blurb = 'Blurb is required';
      if (genre.length === 0) newErr.genre = 'Select at least one genre';
      if (accessType === 'Paid') {
         if (!price || price <= 0) newErr.price = 'Enter a valid price';
      }
      // Image validation
      if (coverImage) {
         const { size, type } = coverImage;
         const mb = size / (1024 * 1024);
         if (!/^image\/(jpeg|png|webp)$/i.test(type)) {
            newErr.coverImage = "JPEG / PNG / WEBP only.";
         } else if (mb > 2) {
            newErr.coverImage = "Image size must be less than 2 MB.";
         }
      }
      return newErr;
   };


   const handleSubmit = async (e) => {
      e.preventDefault();

      const newErr = validate();
      if (Object.keys(newErr).length) {
         setErrors(newErr);
         return;
      }

      const formData = new FormData();
      formData.append('title', bookTitle);
      formData.append('englishTitle', englishTitle);
      formData.append('slug', slug);
      formData.append('tagline', tagline);
      formData.append('blurb', blurb);
      if (coverImage) formData.append('coverImage', coverImage);
      formData.append('shouldRemoveImage', shouldRemoveImage);
      formData.append('language', language);
      // formData.append('releaseStatus', releaseStatus);  // auto update based on publish date (in backend).
      formData.append('publicationDate', publicationDate);
      formData.append('accessType', accessType);
      formData.append('price', accessType === 'Paid' ? price : 0);
      genre.forEach(g => formData.append('genre[]', g));

      try {
         setLoading(true);
         await apiCalls.updateBook(book.id, formData);
         toast.success('Book updated successfully!');
         await onBookUpdate(); // Refresh book data
         onClose();  // Close the modal
      } catch (error) {
         console.error('Error updating book :', error);
         let errorMessage = error.response?.data?.error || firebaseErrorMap.get(error?.code) || 'An unexpected error occurred. Please try again.';
         toast.error(errorMessage);
      } finally {
         setLoading(false);
         setShouldRemoveImage(false); // Reset after submission
      }
   };

   if (loading) return <LoadingSpinner1 />;



   return (
      <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
         <div className="edit-book-card bg-slate-100 rounded shadow-md p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-center mb-4">Edit Book</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
               {/* TITLE */}
               <div>
                  <label className="block font-medium text-sm sm:text-base">
                     Book Title <span className="text-red-600">*</span>
                  </label>
                  <input
                     className="w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500"
                     placeholder="Title *"
                     value={bookTitle}
                     onChange={e => {
                        handleBookTitle(e.target.value);
                        clearErr('bookTitle');
                     }}
                  />
                  {errors.bookTitle && <p className="text-red-600 text-sm mt-1">{errors.bookTitle}</p>}
               </div>

               {/* ENGLISH TITLE */}
               <div>
                  <label className="block font-medium text-sm sm:text-base">
                     English Title <span className="text-red-600">*</span>
                  </label>
                  <input
                     className="w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500 bg-gray-100"
                     placeholder="English Title"
                     value={englishTitle}
                     readOnly
                  />
                  {slug && <p className="text-sm text-gray-500 mt-1">Slug: {slug}</p>}
                  {errors.englishTitle && <p className="text-red-600 text-sm mt-1">{errors.englishTitle}</p>}
               </div>

               {/* TAGLINE */}
               <div>
                  <label className="block font-medium text-sm sm:text-base">
                     Tagline <span className="text-red-600">*</span>
                  </label>
                  <input
                     type="text"
                     placeholder="Tagline"
                     value={tagline}
                     className="w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500"
                     onChange={e => {
                        setTagline(e.target.value);
                        clearErr('tagline');
                     }}
                  />
                  {errors.tagline && <p className="text-red-600 text-sm mt-1">{errors.tagline}</p>}
               </div>

               {/* BLURB */}
               <div>
                  <label className="block font-medium text-sm sm:text-base">
                     Blurb <span className="text-red-600">*</span>
                  </label>
                  <textarea
                     placeholder="Blurb"
                     className="w-full border border-gray-500 px-3 py-2 rounded text-sm sm:text-base"
                     rows="5"
                     value={blurb}
                     onChange={e => {
                        setBlurb(e.target.value);
                        clearErr('blurb');
                     }}
                  />
                  {errors.blurb && <p className="text-red-600 text-sm mt-1">{errors.blurb}</p>}
               </div>

               {/* COVER UPLOAD */}
               <div className="flex flex-wrap items-end gap-4 mt-1 mb-5">
                  <input
                     ref={fileInputRef}
                     id="coverInput"
                     type="file"
                     accept="image/*"
                     onChange={e => {
                        if (e.target.files?.[0]) {
                           setCoverImage(e.target.files[0]);
                           setShouldRemoveImage(false);
                           clearErr('coverImage');
                        }
                     }}
                     className="hidden"
                  />

                  {preview && (
                     <div className="relative w-[120px] h-[160px] rounded overflow-hidden shadow-sm shadow-slate-400">
                        <img
                           src={preview}
                           alt="cover preview"
                           className="w-full h-full object-cover"
                        />
                        <button
                           type="button"
                           onClick={removeImage}
                           className="absolute -top-1 -right-1 bg-red-600 text-white 
                           w-6 h-6 rounded-full flex items-center justify-center text-sm 
                                       hover:bg-red-700 shadow"
                                       title="Remove image">
                           ×
                        </button>
                     </div>
                  )}

                  <div className="flex flex-col justify-end">
                     {errors.coverImage && <p className="text-red-600 text-sm mt-1">{errors.coverImage}</p>}
                     <label
                        htmlFor="coverInput"
                        className="bg-blue-600 text-white px-4 py-2 rounded 
                                 cursor-pointer hover:bg-blue-700 text-sm">
                        {preview ? "Change Cover" : "Upload Cover Image"}
                     </label>
                  </div>
               </div>

               {/* GENRE CHIPS */}
               <div>
                  <label className="block font-medium text-sm sm:text-base">
                     Choose Genre <span className="text-red-600">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                     {genreOptions.map(g => (
                        <label
                           key={g}
                           className={`px-3 py-1 rounded cursor-pointer text-sm sm:text-base border ${
                              genre.includes(g) 
                                 ? 'bg-[var(--primary-color)] text-white border-transparent' 
                                 : 'border-gray-500'
                           }`}
                        >
                           <input
                              type="checkbox"
                              checked={genre.includes(g)}
                              onChange={() => {
                                 toggleGenre(g);
                                 clearErr('genre');
                              }}
                              className="hidden"
                           />
                           {g}
                        </label>
                     ))}
                  </div>
                  {errors.genre && <p className="text-red-600 text-sm mt-1">{errors.genre}</p>}
               </div>

               {/* LANGUAGE / ACCESS / PRICE */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                     <label className="block font-medium text-sm sm:text-base">
                        Language <span className="text-red-600">*</span>
                     </label>
                     <select
                        value={language}
                        onChange={e => {
                           setLanguage(e.target.value);
                           clearErr('language');
                        }}
                        className="input w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500"
                     >
                        <option value="">Select Language *</option>
                        <option value="English">English</option>
                        <option value="Malayalam">Malayalam</option>
                     </select>
                     {errors.language && <p className="text-red-600 text-sm mt-1">{errors.language}</p>}
                  </div>

                  <div className="flex gap-4 w-full">
                     <div className="w-1/2">
                        <label className="block font-medium text-sm sm:text-base">
                           Access Type <span className="text-red-600">*</span>
                        </label>
                        <select
                           value={accessType}
                           onChange={e => setAccessType(e.target.value)}
                           className="input w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500"
                        >
                           <option value="Free">Free</option>
                           <option value="Paid">Paid</option>
                        </select>
                     </div>
                     {accessType === 'Paid' && (
                        <div className="w-1/2">
                           <label className="block font-medium text-sm sm:text-base">
                              Price <span className="text-red-600">*</span>
                           </label>
                           <input
                              type="number"
                              placeholder="Price (₹)"
                              value={price}
                              onChange={e => {
                                 setPrice(Number(e.target.value));
                                 clearErr('price');
                              }}
                              className="w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500"
                           />
                           {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                        </div>
                     )}
                  </div>
               </div>

               {/* PUBLICATION DATE / RELEASE STATUS */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                     <label className="block font-medium text-sm sm:text-base">Publication Date</label>
                     <input
                        type="date"
                        value={publicationDate}
                        onChange={e => setPublicationDate(e.target.value)}
                        className="w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500"
                     />
                  </div>
                  <div className="w-full sm:w-1/2">
                     <label className="block font-medium text-sm sm:text-base">Release Status</label>
                     <input
                        type="text"
                        value={releaseStatus}
                        readOnly
                        className="w-full text-sm sm:text-base rounded px-3 py-2 border border-gray-500 bg-gray-100"
                     />
                  </div>
               </div>

               {/* ACTION BUTTONS */}
               <div className="flex justify-end gap-3 mt-6">
                  <button
                     type="button"
                     onClick={onClose}
                     className="cancel-btn px-4 py-2 rounded text-sm sm:text-base">
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm sm:text-base">
                     Update Book
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default EditBookForm;