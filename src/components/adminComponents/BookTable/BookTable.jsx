// src/components/adminComponents/BookTable/BookTable.jsx
import React from 'react';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';

const BookTable = ({ books }) => {
   const navigate = useNavigate();

   const handleActionClick = (e) => {
      // Prevent row link navigation when clicking on action buttons
      e.stopPropagation();
   };


   return (
      <div className="w-full overflow-x-auto">
         <h1 className="text-2xl text-center font-bold mb-4">Books List</h1>

         <table className="min-w-[800px] w-full table-auto border-collapse border border-gray-600">
            <thead className='table-head'>
               <tr className="text-sm">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Cover</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Chapters</th>
                  <th className="px-4 py-2">Moments</th>
                  <th className="px-4 py-2">Rating</th>
                  <th className="px-4 py-2">Reviews</th>
                  <th className="px-4 py-2">Views</th>
                  <th className="px-4 py-2">Actions</th>
               </tr>
            </thead>

            <tbody className='table-body'>
               {books.length ? 
                  books.map((book, index) => (
                  <tr 
                     key={book.id} 
                     className="table-body-row cursor-pointer border border-gray-600 hover:bg-gray-50"
                     onClick={() => navigate(`/admin/books/${book.id}`)} >
                     <td className="px-4 py-2 text-center">{index + 1}</td>
                     <td className="px-4 py-2">
                        <img 
                        src={book.coverImageUrl} 
                        alt={book.title} 
                        className="w-12 h-16 object-cover rounded"
                        />
                     </td>
                     <td className="px-4 py-2">{book.title}</td>
                     <td className="px-4 py-2 text-center">{book.chapterCount}</td>
                     <td className="px-4 py-2 text-center">{book.momentCount}</td>
                     <td className="px-4 py-2 text-center">{book.ratingAverage?.toFixed(1)}</td>
                     <td className="px-4 py-2 text-center">{book.reviewCount}</td>
                     <td className="px-4 py-2 text-center">{book.viewCount}</td>
                     <td 
                        className="px-4 py-2 flex-row gap-2 justify-center"
                        onClick={handleActionClick} >
                        <button className="p-1 hover:text-[var(--primary-color)]">
                           <HiPencil />
                        </button>
                        <button className="p-1 hover:text-[var(--primary-color)]">
                           <HiTrash />
                        </button>
                     </td>
                  </tr>
                  ))
                  : 
                  (
                  <tr className='text-center'>
                     <td colSpan={9} className='p-5 text-sm text-red-500'>NO BOOKS AVAILABLE</td>
                  </tr>
                  )
               }
            </tbody>
         </table>
      </div>
   );
};

export default BookTable;