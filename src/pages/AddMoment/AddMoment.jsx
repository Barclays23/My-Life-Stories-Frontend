import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner1 from '../../components/Loading Spinner/LoadingSpinner1';
import LoadingSpinner2 from '../../components/Loading Spinner/LoadingSpinner2';
// import './AddMoment.css';

const AddMoment = () => {
  const { bookId, chapterId } = useParams();
  const [bookTitle, setBookTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [momentTitle, setMomentTitle] = useState('');
  const [content, setContent] = useState('');
  const [pageLoading, setPageLoading] = useState(true); // For initial data fetch
  const [formLoading, setFormLoading] = useState(false); // For form submission
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);
        const bookDoc = await getDoc(doc(db, 'books', bookId));
        if (bookDoc.exists()) setBookTitle(bookDoc.data().title);

        const chapterDoc = await getDoc(doc(db, 'chapters', chapterId));
        if (chapterDoc.exists()) setChapterTitle(chapterDoc.data().chapterTitle);
      } catch (error) {
        toast.error('Failed to load data: ' + error.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [bookId, chapterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.createMoment(token, { chapterId, momentTitle, content });
      toast.success('Moment added successfully!');
      navigate(`/book/${bookId}/chapter/${chapterId}`);
    } catch (error) {
      toast.error('Failed to add moment: ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingSpinner2 />;
  }

  if (formLoading) {
    return <LoadingSpinner1 />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{bookTitle}</h1>
      <h2 className="text-2xl font-bold mb-6">{chapterTitle}</h2>
      <h3 className="text-xl font-bold mb-4">Add New Moment</h3>
      <div className="max-w-md mx-auto">
        <div className="form-group">
          <input
            type="text"
            placeholder="Moment Title"
            value={momentTitle}
            onChange={(e) => setMomentTitle(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Moment Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input"
            rows="6"
            required
          />
        </div>
        <button onClick={handleSubmit} className="btn">Add Moment</button>
      </div>
    </div>
  );
};

export default AddMoment;