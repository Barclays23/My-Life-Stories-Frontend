import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import BookCard from '../components/BookCard';

const Books = () => {
  const [books, setBooks] = useState([]);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const booksSnapshot = await getDocs(collection(db, 'books'));
      let booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (!isAdmin) {
        booksList = booksList.filter(book => book.isPublished && book.releaseStatus !== 'Temporarily Unavailable');
      }
      setBooks(booksList);
    };

    fetchBooks();
  }, [isAdmin]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">All Books</h1>
      {isAdmin && (
        <div className="text-center mb-6">
          <button
            onClick={() => navigate('/create-book')}
            className="btn bg-primary-color text-white px-6 py-2 rounded"
          >
            Create Book
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Books;