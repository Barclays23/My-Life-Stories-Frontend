import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AddMoment = () => {
  const { bookId, chapterId } = useParams();
  const [bookTitle, setBookTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [momentTitle, setMomentTitle] = useState('');
  const [content, setContent] = useState('');
  const [moments, setMoments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const bookDoc = await getDoc(doc(db, 'books', bookId));
      if (bookDoc.exists()) {
        setBookTitle(bookDoc.data().title);
      }

      const chapterDoc = await getDoc(doc(db, 'chapters', chapterId));
      if (chapterDoc.exists()) {
        setChapterTitle(chapterDoc.data().chapterTitle);
      }

      const momentsSnapshot = await getDocs(collection(db, 'moments'));
      const momentsList = momentsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(moment => moment.chapterId === chapterId);
      setMoments(momentsList);
    };

    fetchData();
  }, [bookId, chapterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMomentNumber = moments.length + 1;
      await addDoc(collection(db, 'moments'), {
        chapterId,
        momentTitle,
        content,
        momentNumber: newMomentNumber,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success('Moment added successfully!');
      navigate(`/book/${bookId}/chapter/${chapterId}`);
    } catch (error) {
      toast.error('Failed to add moment.');
      console.error(error);
    }
  };

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