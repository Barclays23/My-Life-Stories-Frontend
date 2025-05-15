import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import LoadingSpinner2 from '../../components/Loading Spinner/LoadingSpinner2';
import StoryCard from '../../components/StoryCard/StoryCard';
import './Stories.css';

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartsAndImages = async () => {
      try {
        const partsSnapshot = await getDocs(collection(db, 'parts'));
        const storiesSnapshot = await getDocs(collection(db, 'stories'));

        const stories = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const partList = partsSnapshot.docs.map(doc => {
          const partData = doc.data();
          const partStories = stories.filter(s => s.partId === partData.partNumber);
          console.log(`Part ${partData.partNumber}: partStories=`, partStories); // Debug

          const firstStory = partStories.find(s => s.serialNumber === 1) ||
                            partStories.sort((a, b) => a.serialNumber - b.serialNumber)[0];
          console.log(`Part ${partData.partNumber}: firstStory=`, firstStory); // Debug

          const storiesWithImages = partStories.filter(s => s.imageURL && s.imageURL !== '');
          console.log(`Part ${partData.partNumber}: storiesWithImages=`, storiesWithImages); // Debug
          
          const randomImage = storiesWithImages.length > 0
            ? storiesWithImages[Math.floor(Math.random() * storiesWithImages.length)].imageURL
            : '/assets/images/Default-Story-Image.jpg';

          return { id: doc.id, ...partData, randomImage, firstStory };
        });

        setParts(partList.sort((a, b) => a.partNumber - b.partNumber));
        console.log('Parts:', partList); // Debug

        await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
      } catch (err) {
        toast.error('Error fetching parts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartsAndImages();
  }, []);

  if (loading) {
    return <LoadingSpinner2 />;
  }

  return (
    <div className="stories mt-16">
      <div className="container mx-auto py-8 px-3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Story Parts</h2>
          {currentUser && currentUser.isAdmin && (
            <Link to="/add-story" className="btn">Add Story</Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map(part => (
            <StoryCard key={part.id} part={part} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories;