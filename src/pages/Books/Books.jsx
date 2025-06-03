import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import BookCard from '../../components/BookCard/BookCard';
import LoadingSpinner2 from '../../components/Loading Spinner/LoadingSpinner2';
import { toast } from 'react-toastify';
import apiCalls from '../../utils/api';



const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);


  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();


    useEffect(() => {
    // const fetchHeroes = async () => {
    //   try {
    //     const result = await apiCalls.getHeroes();
    //     setHeroes(result.data || []);
    //   } catch (error) {
    //     console.error('Error fetching heroes:', error);
    //     toast.error('Failed to load heroes');
    //   }
    // };

    const fetchBooks = async () => {
      try {
        const result = await apiCalls.getBooks();
        setBooks(result.publishedBooks || []);

      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to load books');
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([ fetchBooks()]);
      setLoading(false);
    };

    loadData();

  }, []);

  console.log('Number of published Books: ', books.length);
  



  if (loading) return <LoadingSpinner2 />;


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">All Books</h1>
      {currentUser?.isAdmin && (
        <div className="text-center mb-6">
          <button
            onClick={() => navigate('/admin/create-book')}
            // onClick={() => navigate('/create-book')}
            className="btn bg-primary-color text-white px-6 py-2 rounded" >
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