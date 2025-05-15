import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/books/${book.title.toLowerCase().replace(/\s+/g, '-')}-${book.id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-accent-color rounded-lg shadow-md p-4 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={book.coverImage || 'https://via.placeholder.com/150'}
        alt={book.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-bold text-primary-color">{book.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{book.tagline}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{book.blurb.slice(0, 100)}...</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm">{book.accessType === 'Free' ? 'Free' : `₹${book.price}`}</span>
        <span className="text-sm">{book.releaseStatus}</span>
      </div>
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < Math.round(book.ratingAverage) ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-sm">({book.ratingCount})</span>
      </div>
    </div>
  );
};

export default BookCard;