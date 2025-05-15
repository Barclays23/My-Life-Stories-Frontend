import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import BookCard from '../../components/BookCard/BookCard';
import Hero from '../../components/Hero/Hero';

const Home = () => {
  const [heroes, setHeroes] = useState([]);
  const [books, setBooks] = useState([]);
  const [randomBooks, setRandomBooks] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const { currentUser, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroes = async () => {
      const heroesSnapshot = await getDocs(collection(db, 'hero'));
      const heroesList = heroesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHeroes(heroesList);
    };

    const fetchBooks = async () => {
      const booksSnapshot = await getDocs(collection(db, 'books'));
      let booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (!isAdmin) {
        booksList = booksList.filter(book => book.isPublished && book.releaseStatus !== 'Temporarily Unavailable');
      }
      setBooks(booksList);

      // Select 3 random books
      const shuffled = booksList.sort(() => 0.5 - Math.random());
      setRandomBooks(shuffled.slice(0, 3));
    };

    fetchHeroes();
    fetchBooks();

    // Auto-swipe hero every 5 seconds
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAdmin, heroes.length]);

  const handleBookClick = (book) => {
    if (!currentUser) {
      toast.info('Please log in to access the book.');
      return;
    }
    if (book.accessType === 'Paid') {
      // Check payment status (to be implemented in Book.jsx)
      toast.info('Please purchase the book to access it.');
      return;
    }
    navigate(`/book/${book.title.toLowerCase().replace(/\s+/g, '-')}-${book.id}`);
  };

  if (!heroes.length) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section with Auto-Swipe */}
      <div className="relative">
        <Hero hero={heroes[currentHeroIndex]} />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentHeroIndex ? 'bg-primary-color' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>

      {/* Random Books Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Discover Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {randomBooks.map(book => (
          <div key={book.id} onClick={() => handleBookClick(book)}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;






// // OLD FILE
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import Hero from '../../components/Hero/Hero';
// import StoryCard from '../../components/StoryCard/StoryCard';
// import { db } from '../../firebase/firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import './Home.css';

// const Home = () => {
//   const [parts, setParts] = useState([]);

//   useEffect(() => {
//       const fetchPartsAndStories = async () => {
//          try {
//          const partsSnapshot = await getDocs(collection(db, 'parts'));
//          const storiesSnapshot = await getDocs(collection(db, 'stories'));

//          const stories = storiesSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//          }));

//          const partList = partsSnapshot.docs.map(doc => {
//             const partData = doc.data();
            
//             const partStories = stories.filter(s => s.partId === partData.partNumber);
//             //  console.log(`Part ${partData.partNumber}: partStories=`, partStories); // Debug
            
//             const firstStory = partStories.find(s => s.serialNumber === 1) ||
//                               partStories.sort((a, b) => a.serialNumber - b.serialNumber)[0];
//             //  console.log(`Part ${partData.partNumber}: firstStory=`, firstStory); // Debug

//             const storiesWithImages = partStories.filter(s => s.imageURL && s.imageURL !== '');

//             const randomImage = storiesWithImages.length > 0
//                ? storiesWithImages[Math.floor(Math.random() * storiesWithImages.length)].imageURL
//                : '/assets/images/Default-Story-Image.jpg';

//             return {
//                id: doc.id,
//                partNumber: partData.partNumber,
//                title: partData.title,
//                randomImage,
//                firstStory,
//             };
//          });

//          // Select 3 random parts
//          const randomParts = partList.sort(() => Math.random() - 0.5).slice(0, 3);

//          setParts(randomParts);
//          //   console.log('Home parts:', randomParts); // Debug

//          } catch (err) {
//             console.error('Error fetching parts and stories:', err);
//          }
//       };

//       fetchPartsAndStories();
//    }, []);



//    return (
//       <div className="home mt-16">
//          <Hero />
//          <div className="container mx-auto py-8 px-3">
//          <h2 className="text-3xl font-bold mb-6">Featured Stories</h2>
//          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {parts.map(part => (
//                <StoryCard key={part.id} part={part} />
//             ))}
//          </div>
//          <div className="text-center mt-6">
//             <Link to="/stories" className="hover:text-red-600">
//                More Stories
//             </Link>
//          </div>
//          </div>
//       </div>
//    );
// };

// export default Home;