// src/components/adminComponents/ChapterManagement/ChapterManagement.jsx
import React, { useState } from 'react';
import AddChapterForm from '../AddChapterForm/AddChapterForm';
import ChapterList from '../ChapterList/ChapterList';
import EditChapterModal from '../EditChapterModal/EditChapterModal';
import DeleteChapterModal from '../DeleteChapterModal/DeleteChapterModal';
import LoadingSpinner1 from '../../Loading Spinner/LoadingSpinner1';
import LoadingSpinner2 from '../../Loading Spinner/LoadingSpinner2';
import apiCalls from '../../../utils/api';
import { toast } from 'react-toastify';



const ChapterManagement = ({ book, chapters, onChaptersUpdate, onBookUpdate }) => {
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showEditChapter, setShowEditChapter] = useState(false);
  const [showDeleteChapter, setShowDeleteChapter] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const handleEditChapter = async ({ title, number }) => {
    try {
      setLoading(true);
      const res = await apiCalls.updateChapter({
        bookId: book.id,
        chapterId: selectedChapter.id,
        newChapterTitle: title,
        newChapterNumber: number,
      });
      toast.success('Chapter Updated Successfully!');
      await onChaptersUpdate();  // updating ChapterList
      setShowEditChapter(false);
      setSelectedChapter(null);
    } catch (error) {
      console.log('Error in handleEditChapter:', error?.response?.data?.message || error?.response?.data?.error || error?.message);
      const message =
        error?.response?.data?.message ||                       // For Axios or HTTP-based errors
        firebaseErrorMap.get(error?.code) ||                   // For Firebase-specific errors
        error?.message ||                                      // Generic JS or Firebase fallback
        "An unexpected error occurred while updating the chapter.";                       // Final fallback
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId, password) => {
    try {
      setLoading(true);
      const res = await apiCalls.deleteChapter(book.id, chapterId, password );
      toast.success('Chapter deleted successfully!');
      await Promise.all([onBookUpdate(), onChaptersUpdate()]);  // updating BookBanner & ChapterList
      setShowDeleteChapter(false);
      setSelectedChapter(null);
    } catch (error) {
      console.log('Error in handleDeleteChapter:', error?.response?.data?.message || error?.response?.data?.error || error?.message);
      const message =
        error?.response?.data?.message ||                       // For Axios or HTTP-based errors
        firebaseErrorMap.get(error?.code) ||                   // For Firebase-specific errors
        error?.message ||                                      // Generic JS or Firebase fallback
        "An unexpected error occurred while deleting the chapter.";                       // Final fallback
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (chapter) => {
    setSelectedChapter(chapter);
    setShowEditChapter(true);
  };

  const handleDeleteClick = (chapter) => {
    setSelectedChapter(chapter);
    setShowDeleteChapter(true);
  };


  if (loading) return <LoadingSpinner2 />;


  return (
    <div className="mt-6">
      <div className="text-right flex justify-end">
        <button
          onClick={() => setShowAddChapter(true)}
          className="mt-6 mb-2 bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
          disabled={loading}
        >
          Add Chapter
        </button>
      </div>

      {showAddChapter && (
        <AddChapterForm
          bookData={book}
          existingChapters={book.chapterCount}
          onClose={() => setShowAddChapter(false)}
          onChaptersUpdate={onChaptersUpdate}
          onBookUpdate={onBookUpdate}
        />
      )}

      <ChapterList
        bookId={book.id}
        chapters={chapters}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {showEditChapter && selectedChapter && (
        <EditChapterModal
          bookData={book}
          editChapter={selectedChapter}
          maxNumber={book.chapterCount}
          onSave={handleEditChapter}
          onClose={() => {
            setShowEditChapter(false);
            setSelectedChapter(null);
          }}
        />
      )}

      {showDeleteChapter && selectedChapter && (
        <DeleteChapterModal
          bookData={book}
          chapterData={selectedChapter}
          onConfirm={handleDeleteChapter}
          onClose={() => {
            setShowDeleteChapter(false);
            setSelectedChapter(null);
          }}
        />
      )}
    </div>
  );
};

export default ChapterManagement;