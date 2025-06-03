import React, { useState, useEffect, useRef  } from 'react';
import apiCalls from "../../../utils/api";
// import { ml2en } from '../../../utils/ml2en';
import { ml2en } from '../../../utils/transliterate';
import './CreateBookForm.css';
import LoadingSpinner2 from '../../Loading Spinner/LoadingSpinner2';
import LoadingSpinner1 from '../../Loading Spinner/LoadingSpinner1';
import { firebaseErrorMap } from '../../../firebase/firebaseErrorMap';
import { toast } from 'react-toastify';



const CreateBookForm = ({ onClose }) => {
   const [bookTitle, setBookTitle] = useState('');
   const [englishTitle, setEnglishTitle] = useState('');
   const [slug, setSlug] = useState('');  // for custom URL title paths

   const [tagline, setTagline] = useState('');
   const [blurb, setBlurb] = useState('');
   const [coverImage, setCoverImage] = useState(null);
   const [preview, setPreview]   = useState(null);
   const [genre, setGenre] = useState([]);
   const [language, setLanguage] = useState('');
   const [releaseStatus, setReleaseStatus] = useState('Draft');
   const [publicationDate, setPublicationDate] = useState('');
   const [accessType, setAccessType] = useState('Free');
   const [price, setPrice] = useState(0);

   const [errors, setErrors]         = useState({});   // { fieldName: 'message' }
   const [loading, setLoading] = useState(false);

   const fileInputRef = useRef();



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
         .toLowerCase()                    // convert to lowercase
         .trim()                           // remove leading/trailing whitespace
         .replace(/[^\w\s-]/g, '')         // remove non-word characters (punctuation, symbols)
         .replace(/\s+/g, '-')             // replace spaces with hyphens
         .replace(/--+/g, '-');            // collapse multiple hyphens
   }


  
   /* ---------- preview logic ---------- */
   useEffect(() => {
      if (!coverImage) {
         setPreview(null);
         return;
      }
      const objectUrl = URL.createObjectURL(coverImage);
      setPreview(objectUrl);

      // free memory when component unmounts OR when a new file is picked
      return () => URL.revokeObjectURL(objectUrl);
   }, [coverImage]);

   const removeImage = () => {
      setCoverImage(null);
      setPreview(null);
      fileInputRef.current.value = '';        // reset hidden <input>
      setErrors(prev => ({ ...prev, coverImage: null }));
   };


   const genreOptions = ['Memoir', 'Travel', 'Story', 'History', 'Poetry', 'Fiction', 'Non-Fiction', 'Sports', 'Romance', 'Spiritual', 'Articles'];

   const toggleGenre = (g) => {
      setGenre(prev => prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]);
   };

   const clearErr = field => setErrors(e => ({ ...e, [field]: null }));  // when re-typing


   
   // VALIDATION ────────────────────────────────────────── */
   const validate = () => {
      const newErr = {};
      if (!bookTitle.trim())                   newErr.bookTitle      = 'Title is required';
      if (!language)                       newErr.language   = 'Please choose a language';
      if (!englishTitle.trim()) newErr.englishTitle = 'English title is required';
      if (!tagline.trim()) newErr.tagline = 'Tagline is required';
      if (!blurb.trim()) newErr.blurb = 'Blurb is required';
      if (!coverImage)                     newErr.coverImage = 'Cover image is required';
      if (genre.length === 0)              newErr.genre      = 'Select at least one genre';
      if (accessType === 'Paid') {
         if (!price || price <= 0)          newErr.price      = 'Enter a valid price';
      }
      return newErr;
   };


   const handleSubmit = async (e) => {
      e.preventDefault();

      const newErr = validate();

      if (Object.keys(newErr).length) {
         setErrors(newErr);
         return;                        // block submit
      }

      const formData = new FormData();

      formData.append('title', bookTitle);
      formData.append('englishTitle', englishTitle);
      formData.append('slug', slug);    // for friendly URL paths eg: books/ente-katha from എന്റെ കഥ
      formData.append('tagline', tagline);
      formData.append('blurb', blurb);
      if (coverImage) formData.append('coverImage', coverImage);
      formData.append('language', language);
      formData.append('releaseStatus', releaseStatus);        // initially 'draft' when creating book.
      formData.append('publicationDate', publicationDate);   // no date when creating book
      formData.append('accessType', accessType);
      formData.append('price', accessType === 'Paid' ? price : 0);
      genre.forEach(g => formData.append('genre[]', g));
      // formData.append('chapterCount', 0);  // initially no chapters in book
      // formData.append('momentCount', 0);  // initially no moments in book



      try {
         setLoading(true);
         const res = await apiCalls.createBook(formData);
         toast.success(`Book "${res.title}" has been created successfully!`);
         onClose(); // Close form after creation

      } catch (error) {
         console.error('Error creating book :', error);
         // Prioritize backend error message if available
         let errorMessage = error.response?.data?.error || firebaseErrorMap.get(error?.code) || 'An unexpected error occurred. Please try again.';
         toast.error(errorMessage);

      } finally {
         setLoading(false);
      }

   };


   if (loading) return <LoadingSpinner1 />;


   return (
      <div className="form-container max-w-3xl mx-auto shadow-md rounded p-6 mt-8">
         <h2 className="text-xl font-bold mb-4 text-center">Create New Book</h2>
         <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {/* TITLE */}
            <div>
               <label htmlFor="bookTitle" className="text-sm">Book Title <span className='text-red-600'> * </span> </label>
               <input
                  className="input"
                  placeholder="Title *"
                  value={bookTitle}
                  onChange={e => {
                  handleBookTitle(e.target.value);
                  clearErr('bookTitle');
                  setErrors(p => ({ ...p, bookTitle: null }));
                  }}
               />
               {errors.bookTitle && <p className="error-msg">{errors.bookTitle}</p>}
            </div>

            {/* ENGLISH TITLE */}
            <div>
               <label htmlFor="englishTitle" className="text-sm">English Title <span className='text-red-600'> * </span> </label>
               <input
                  className="input"
                  placeholder="English Title"
                  value={englishTitle}
                  readOnly
                  // onChange={e => setEnglishTitle(e.target.value)}
                  // onChange={e => {
                  //    handleEnglishTitle(e.target.value);
                  //    clearErr('englishTitle');
                  // }}
               />
               {slug && <p className="text-sm text-gray-500">Slug: {slug}</p>}
               {errors.englishTitle && <p className="error-msg">{errors.englishTitle}</p>}
            </div>

            {/* TAGLINE */}
            <div>
               <label htmlFor="tagline" className="text-sm">Tagline <span className='text-red-600'> * </span> </label>
               <input type="text" placeholder="Tagline"
                  value={tagline}
                  className="input" 
                  onChange={e => {
                     setTagline(e.target.value);
                     clearErr('tagline');
                  }
               }/>
               {errors.tagline && <p className="error-msg">{errors.tagline}</p>}
            </div>

            {/* BLURB */}
            <div>
               <label htmlFor="blurb" className="text-sm">Blurb <span className='text-red-600'> * </span> </label>
               <textarea placeholder="Blurb"
                  className="input" rows="4"
                  value={blurb}
                  onChange={e => {
                     setBlurb(e.target.value);
                     clearErr('blurb');
                  }
               }/>
               {errors.blurb && <p className="error-msg">{errors.blurb}</p>}
            </div>

            {/* COVER UPLOAD */}
            <div className="image-section">
               <input
                  ref={fileInputRef}
                  id="coverInput"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                     setCoverImage(e.target.files[0]);
                     clearErr('coverImage');
                     setErrors(p => ({ ...p, coverImage: null }));
                  }}
                  className="hidden"
               />

               {preview && (
                  <div className="thumb-wrapper mt-2 mr-4 inline-flex relative">
                  <img src={preview} alt="cover preview" className="thumb-img" />
                  <button className="remove-btn" type="button" onClick={removeImage}>×</button>
                  </div>
               )}

               <label htmlFor="coverInput" className="file-btn">
                  {coverImage ? 'Change Cover' : 'Upload Cover Image'}
               </label>

               {errors.coverImage && <p className="error-msg">{errors.coverImage}</p>}
            </div>

            {/* GENRE CHIPS */}
            <div>
               <label htmlFor="genre" className="text-sm">Choose Genre <span className='text-red-600'> * </span> </label>
               <div className="flex flex-wrap gap-2">
                  {genreOptions.map(g => (
                  <label key={g}
                     className={`genre-label px-3 py-1 rounded cursor-pointer ${
                     genre.includes(g) ? 'bg-[var(--primary-color)] text-white' : ''}`}>
                     <input
                        type="checkbox"
                        checked={genre.includes(g)}
                        onChange={() => {
                           toggleGenre(g);
                           setErrors(p => ({ ...p, genre: null }));
                           clearErr('genre');
                        }}
                        className="hidden" />
                     {g}
                  </label>
                  ))}
               </div>
               {errors.genre && <p className="error-msg">{errors.genre}</p>}
            </div>

            {/* --- LANGUAGE / ACCESS / PRICE --- */}
            <div className="flex flex-col sm:flex-row gap-4">
               {/* LANGUAGE */}
               <div className="w-full">
                  <label htmlFor="language" className="text-sm">Language <span className='text-red-600'> * </span> </label>
                  <select
                     value={language}
                     onChange={e => {
                        setLanguage(e.target.value);
                        clearErr('language');
                     }}
                     className="input w-full" >
                     <option value="">Select Language *</option>
                     <option value="English">English</option>
                     <option value="Malayalam">Malayalam</option>
                  </select>
                  {errors.language && <p className="error-msg">{errors.language}</p>}
               </div>

               {/* ACCESS TYPE & PRICE */}
               <div className="flex gap-4 w-full">
                  <div className="w-1/2">
                     <label htmlFor="accessType" className="text-sm">Access Type <span className='text-red-600'> * </span> </label>
                     <select
                        value={accessType}
                        onChange={e => setAccessType(e.target.value)}
                        className="input w-full"
                        >
                        <option value="Free">Free</option>
                        <option value="Paid">Paid</option>
                     </select>
                  </div>

                  {accessType === 'Paid' && (
                     <div className="w-1/2">
                        <label htmlFor="price" className="text-sm">Price <span className='text-red-600'> * </span> </label>
                        <input
                           type="number"
                           placeholder="Price (₹)"
                           value={price}
                           onChange={e => {
                              setPrice(Number(e.target.value));
                              clearErr('price');
                           }}
                           className="input w-full"
                        />
                        {errors.price && <p className="error-msg">{errors.price}</p>}
                     </div>
                  )}
               </div>
            </div>

            {/* <select value={releaseStatus} onChange={e => setReleaseStatus(e.target.value)} className="input">
               <option value="Draft">Draft</option>
               <option value="Coming Soon">Coming Soon</option>
               <option value="New Release">New Release</option>
               <option value="Published">Published</option>
               <option value="Temporarily Unavailable">Temporarily Unavailable</option>
            </select> */}

            {/* <input type="date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)} className="input" /> */}


            {/* ACTION BUTTONS */}
            <div className="flex gap-4 justify-end">
               <button type="button" onClick={onClose} className="cancel-btn px-4 py-2 rounded">
                  Cancel
               </button>
               <button type="submit"
                  className="px-4 py-2 bg-[var(--primary-color)] text-white rounded hover:opacity-90">
                  Create Book
               </button>
            </div>

         </form>
      </div>
   );
};



export default CreateBookForm;