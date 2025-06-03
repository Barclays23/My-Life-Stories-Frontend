import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiCalls from "../../../utils/api";
import AddMomentModal from "../../../components/adminComponents/AddMomentModal/AddMomentModal";
import EditMomentModal from "../../../components/adminComponents/EditMomentModal/EditMomentModal";
import DeleteMomentModal from "../../../components/adminComponents/DeleteMomentModal/DeleteMomentModal";
import AllMoments   from "../../../components/adminComponents/AllMoments/AllMoments";
import LoadingSpinner1 from "../../../components/Loading Spinner/LoadingSpinner1";  // for form submission loading
import LoadingSpinner2 from "../../../components/Loading Spinner/LoadingSpinner2";  // for initial page loading
import { toast } from "react-toastify";
import { firebaseErrorMap } from '../../../firebase/firebaseErrorMap';
import './ChapterMoments.css';




const ChapterMoments = () => {
   const { bookId, chapterNumber } = useParams();
   const [bookData, setBookData] = useState(null);
   const [chapter, setChapter] = useState(null);
   const [moments, setMoments] = useState([]);
   
   
   const [isAddModalOpen, setAddModalOpen] = useState(false);
   const [isEditModalOpen, setEditModalOpen] = useState(false);
   const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
   const [selectedMoment, setSelectedMoment] = useState(null);


   const [loading, setLoading]   = useState(true);  // Controls initial page loading
   const [actionLoading, setActionLoading] = useState(false);  // Used for button/modals actions


   // Load chapter and its moments together
   const refreshData = async () => {
      try {
         // console.log('bookId :', bookId);
         // console.log('chapterNumber :', chapterNumber);
         
         const res = await apiCalls.getMomentsByChapter(bookId, chapterNumber);
         setBookData(res.bookData);
         setChapter(res.chapterData);
         setMoments(res.momentsData);
      } catch (err) {
         toast.error("Failed to load data. Failed to refresh data.");
      }
   };


   useEffect(() => {
      (async () => {
         setLoading(true);
         await refreshData();
         setLoading(false);
      })();
   }, [bookId, chapterNumber]);



   const handleAddMoment = async (momentData) => {
      // console.log('newMoment that send from AddMomentModal :', momentData);
      
      if (!chapter || !chapter?.id) {
         toast.error("Chapter not loaded. Please try again.");
         return;
      }

      const formData = new FormData();
      // add to formData that newMoment (momentData) send from AddMomentModal
      formData.append("momentTitle", momentData.momentTitle.trim());
      formData.append("momentContent", momentData.momentContent.trim());
      if (momentData.momentImage) formData.append("momentImage", momentData.momentImage);
      
      try {
         setActionLoading(true);
         const res = await apiCalls.createMoment(bookId, chapter.id, formData);
         toast.success(`Moment ${res.newMoment.momentNumber} - "${res.newMoment.momentTitle}" is added successfully!`);
         await refreshData();
         setAddModalOpen(false);
         
      } catch (error) {
         // console.log('Error in createMoment:', error?.response?.data?.message || error?.response?.data?.error || error?.message);
         const message =
            error?.response?.data?.message ||                       // For Axios or HTTP-based errors
            firebaseErrorMap.get(error?.code) ||                   // For Firebase-specific errors
            error?.message ||                                      // Generic JS or Firebase fallback
            "An unexpected error occurred.";                       // Final fallback
         toast.error(message);
         
      } finally {
         setActionLoading(false);
      }
   };


   const handleEditMoment = async (momentData) => {
      // console.log('editedMoment that send from EditMomentModal :', momentData);

      if (!chapter || !chapter?.id) {
         toast.error("Chapter not loaded. Please try again.");
         return;
      }

      const formData = new FormData();
      formData.append("updatedMomentNumber", momentData.momentNumber);
      formData.append("updatedMomentTitle", momentData.momentTitle.trim());
      formData.append("updatedMomentContent", momentData.momentContent.trim());
      if (momentData.momentImage) formData.append("updatedMomentImage", momentData.momentImage);
      formData.append("shouldRemoveImage", momentData.shouldRemoveImage);

      try {
         setActionLoading(true);
         const res = await apiCalls.updateMoment(bookId, chapter.id, momentData.momentId, formData);
         // console.log("res.updatedMoment :", res.updatedMoment);
         
         toast.success(`Moment '${res.updatedMoment.momentTitle}' is updated successfully!`);
         await refreshData();
         setEditModalOpen(false);

      } catch (error) {
         console.log('Error in updateMoment:', error?.response?.data?.message || error?.response?.data?.error || error?.message);
         const message =
            error?.response?.data?.message ||                       // For Axios or HTTP-based errors
            firebaseErrorMap.get(error?.code) ||                   // For Firebase-specific errors
            error?.message ||                                      // Generic JS or Firebase fallback
            "An unexpected error occurred.";                       // Final fallback
         toast.error(message);

      } finally {
         setActionLoading(false);
      }
   };


   const handleDeleteMoment = async (momentData, adminPassword) => {
      // console.log('momentData in handleDeleteMoment :', momentData);
      // console.log('adminPassword in handleDeleteMoment :', adminPassword);
      
      if (!chapter?.id) return toast.error("Chapter not loaded.");

      try {
         setActionLoading(true);
         const res = await apiCalls.deleteMoment(bookId, chapter.id, momentData.id, adminPassword);
         toast.success("Moment deleted successfully!");
         await refreshData();
         setDeleteModalOpen(false);

      } catch (error) {
         console.log('Error in deleteMoment:', error?.response?.data?.message || error?.response?.data?.error || error?.message);
         const message =
            error?.response?.data?.message ||                       // For Axios or HTTP-based errors
            firebaseErrorMap.get(error?.code) ||                   // For Firebase-specific errors
            error?.message ||                                      // Generic JS or Firebase fallback
            "An unexpected error occurred.";                       // Final fallback
         toast.error(message);

      } finally {
         setActionLoading(false);
      }
   };


   const openEditModal = (moment) => {
      setSelectedMoment(moment);
      setEditModalOpen(true);
   };

   const openDeleteModal = (moment) => {
      setSelectedMoment(moment);
      setDeleteModalOpen(true);
   };





   if (loading) return <LoadingSpinner2 />;
   
   if (actionLoading) return <LoadingSpinner1 />;



   return (
      <div className="mt-20">
         {/* breadcrumb */}
         <div className="breadcrumb relative rounded-lg overflow-hidden shadow-xl mb-6 h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44">
            <img
               src={bookData?.coverImageUrl || '/assets/images/default-breadcrump-cover-photo.jpg'}
               alt={bookData?.title || 'Book Cover'}
               className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-white/10 dark:bg-black/50 backdrop-blur-sm"></div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
               <h1 className="text-base sm:text-lg md:text-3xl lg:text-4xl font-semibold tracking-wide text-white dark:text-white">
                  {bookData?.title || "Book Title"}
               </h1>
               <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 dark:text-gray-300 mt-1">
                  Chapter {chapter?.chapterNumber} : {chapter?.chapterTitle || "Chapter Title"}
               </h2>
            </div>
         </div>

         <div className="text-right mb-4">
            <button
               className="mb-3 mr-2 bg-green-600 text-white px-4 py-2 rounded"
               onClick={() => setAddModalOpen(true)} >
               Add Moment
            </button>
         </div>

         <AllMoments
            moments={moments}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
         />

         {isAddModalOpen && (
            <AddMomentModal
               isOpen={isAddModalOpen}
               onClose={() => setAddModalOpen(false)}
               onAdd={handleAddMoment}  // newMoment recieve from AddMomentModal
               bookData={bookData}
               chapterData={chapter}
               // loading={actionLoading}
            />
         )}

         {isEditModalOpen && (
            <EditMomentModal
               isOpen={isEditModalOpen}
               onClose={() => setEditModalOpen(false)}
               onEdit={handleEditMoment}
               initialData={selectedMoment}
               bookData={bookData}
               chapterData={chapter}
               // loading={actionLoading}
            />
         )}

         {isDeleteModalOpen && selectedMoment && (
            <DeleteMomentModal
               isOpen={isDeleteModalOpen}
               onClose={() => setDeleteModalOpen(false)}
               onDelete={handleDeleteMoment}
               selectedMoment={selectedMoment}
               loading={actionLoading}
            />
         )}

      </div>
   );
};

export default ChapterMoments;
