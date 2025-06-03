import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import BookCard from '../../components/BookCard/BookCard';
import Hero from '../../components/Hero/Hero';
import Hero2 from '../../components/Hero2/Hero2';
import LoadingSpinner2 from '../../components/Loading Spinner/LoadingSpinner2';
import apiCalls from '../../utils/api';





const Home = () => {
  const [heroes, setHeroes] = useState([]);
  // const [books, setBooks] = useState([]);
  const [randomBooks, setRandomBooks] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const result = await apiCalls.getHeroes();
        setHeroes(result.data || []);
      } catch (error) {
        console.error('Error fetching heroes:', error);
        toast.error('Failed to load heroes');
      }
    };

    const fetchRandomBooks = async () => {
      try {
        const result = await apiCalls.getRandomBooks();

        // setRandomBooks(result.data.randomBooks || []);
        setRandomBooks(result.randomBooks || []);

      } catch (error) {
        console.error('Error fetching random books:', error);
        toast.error('Failed to load random books');
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchHeroes(), fetchRandomBooks()]);
      setLoading(false);
    };

    loadData();

  }, []);

  const handleBookClick = (book) => {
    if (!currentUser) {
      toast.info('Please log in to access the book.');
      return;
    }
    if (book.accessType === 'Paid') {
      toast.info('Please purchase the book to access it.');
      return;
    }
    navigate(`/books/${book.id}`);
  };

  


  const dynamicHeroes = heroes;



  useEffect(() => {
    if (!dynamicHeroes.length) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % dynamicHeroes.length);
    }, 5000);

    return () => clearInterval(interval);

  }, [dynamicHeroes.length]);







  if (loading) return <LoadingSpinner2 />;


  return (
    <div className="mx-auto py-8">

      {/* Hero Section */}
      { !dynamicHeroes.length ? (
        // Show Hero2 component when no heroes are available
        <Hero2 />
      ) : (
        // Show hero carousel when heroes are available (with Auto-Swipe)
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentHeroIndex * 100}%)` }}
          >
            {dynamicHeroes.map((hero, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Hero hero={hero} />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {dynamicHeroes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-3 h-3 rounded-full ${index === currentHeroIndex ? 'bg-primary-color' : 'bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      )}


      {/* Random Books Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4 p-3">Discover Books</h2>
      {randomBooks && randomBooks.length ? 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomBooks.map(book => (
            <div key={book.id} onClick={() => handleBookClick(book)}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
        :
        <div className='text-center'>
          <h2 className="pt-[5%] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-medium text-center">
            NO BOOKS AVAILABLE NOW
          </h2>
        </div>
      }
    </div>
  );
};

export default Home;