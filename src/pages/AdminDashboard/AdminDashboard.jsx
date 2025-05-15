import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [moments, setMoments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const booksSnapshot = await getDocs(collection(db, 'books'));
      const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksList);

      const chaptersSnapshot = await getDocs(collection(db, 'chapters'));
      const chaptersList = chaptersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChapters(chaptersList);

      const momentsSnapshot = await getDocs(collection(db, 'moments'));
      const momentsList = momentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMoments(momentsList);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p>Total Books: {books.length}</p>
            <p>Published: {books.filter(b => b.isPublished).length}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p>Total Chapters: {chapters.length}</p>
            <p>Published: {chapters.filter(c => c.isPublished).length}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p>Total Moments: {moments.length}</p>
            <p>Published: {moments.filter(m => m.isPublished).length}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <div key={book.id} className="bg-white dark:bg-gray-800 border border-accent-color rounded-lg shadow-md p-4">
              <h3 className="text-xl font-bold">{book.title}</h3>
              <p>Status: {book.releaseStatus}</p>
              <p>Access: {book.accessType}</p>
              <button
                onClick={() => navigate(`/book/${book.id}`)}
                className="btn mt-2"
              >
                View Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;