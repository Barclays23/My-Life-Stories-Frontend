// src/pages/adminPages/BooksList.jsx
import React, { useEffect, useState } from 'react';
import apiCalls from "../../../utils/api";
import { HiPencil, HiTrash } from 'react-icons/hi';
import CreateBookForm from '../../../components/adminComponents/CreateBookForm/CreateBookForm';
import BookTable from '../../../components/adminComponents/BookTable/BookTable';
import './BooksList.css';
import { Link } from 'react-router-dom';
import LoadingSpinner2 from '../../../components/Loading Spinner/LoadingSpinner2';




const BooksList = () => {
   const [books, setBooks] = useState([]);
   const [showCreateBookForm, setShowCreateBookForm] = useState(false);
   const [loading, setLoading] = useState(true);


   useEffect(() => {
      const load = async () => {
         try {
            setLoading(true);
            const res = await apiCalls.getBooksList();
            const allBooks = res.data.allBooks;
            // console.log('res.data for admin bookList:', allBooks);
            setBooks(allBooks || []);

         } catch (error) {
            console.error('Failed to fetch books:', error);
            setBooks([]);

         } finally {
            setLoading(false);
         }
      };

      load();
   }, [showCreateBookForm]);


   

   if (loading) return <LoadingSpinner2 />;



   return (
      <section className='mt-16'>
         <div className='text-right flex justify-end'>
            <button 
               onClick={() => setShowCreateBookForm(true)}
               className="bg-[var(--primary-color)] text-white px-4 py-2 pt-3 my-4 rounded text-sm font-extrabold hover:opacity-90"> 
               CREATE BOOK 
            </button>
         </div>

         {showCreateBookForm ? 
            <CreateBookForm onClose={() => setShowCreateBookForm(false)}/>
            :
            <BookTable books={books} />
         }
      </section>
   );
};

export default BooksList;
