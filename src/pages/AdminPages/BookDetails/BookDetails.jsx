import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiCalls from '../../../utils/api';
import { toast } from 'react-toastify';
import { firebaseErrorMap } from '../../../firebase/firebaseErrorMap';
import LoadingSpinner2 from '../../../components/Loading Spinner/LoadingSpinner2';
import BookBanner from '../../../components/adminComponents/BookBanner/BookBanner';
import ChapterManagement from '../../../components/adminComponents/ChapterManagement/ChapterManagement';
import './BookDetails.css';




const BookDetails = () => {
  const { bookId } = useParams();  // provided param name in App.jsx
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // console.log('bookId in bookDetails :', bookId);
  

  // Data fetching
  const loadBookDetails = async () => {
    try {
      const response = await apiCalls.getBookDetails(bookId);
      setBook(response.bookData);
    } catch (err) {
      console.error('Failed to load book details:', err);
      toast.error('Failed to load book details');
    }
  };

  const loadChapters = async () => {
    try {
      const res = await apiCalls.getChaptersByBook(bookId);
      setChapters(res.chapters);
    } catch (err) {
      console.error('Failed to load chapters:', err);
      toast.error('Failed to load chapters');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadBookDetails(), loadChapters()]);
    } finally {
      setLoading(false);
    }
  };

  // Book operations
  const handleTogglePublish = async (shouldPublish, publishDate) => {
    try {
      setLoading(true);
      await apiCalls.togglePublishBook(bookId, shouldPublish, publishDate);
      await loadBookDetails();
      toast.success(
        shouldPublish
          ? "It's official — your book is now live!"
          : "Your book is now hidden from the public."
      );
    } catch (error) {
      const message =
        firebaseErrorMap.get(error?.code) ??
        'An unexpected error occurred. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner2 />;

  return (
    <div className="mt-20">
      <BookBanner
        book={book}
        onTogglePublish={handleTogglePublish}
        onDeleted={() => navigate('/admin/books')}
        onBookUpdate={loadBookDetails} // Pass callback to refresh book data
      />
      <ChapterManagement
        book={book}
        chapters={chapters}
        onChaptersUpdate={loadChapters}
        onBookUpdate={loadBookDetails}
      />
    </div>
  );
};

export default BookDetails;