import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiCalls from '../../../utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner2 from '../../../components/Loading Spinner/LoadingSpinner2';
import BookBanner from '../../../components/adminComponents/BookBanner/BookBanner';
import ChapterManagement from '../../../components/adminComponents/ChapterManagement/ChapterManagement';
import './BookDetails.css';




const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchData();
  }, [bookId]);

  if (loading) return <LoadingSpinner2 />;

  return (
    <div className="mt-20">
      <BookBanner
        book={book}
        onDeleted={() => navigate('/admin/books')}
        onBookUpdate={fetchData}
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