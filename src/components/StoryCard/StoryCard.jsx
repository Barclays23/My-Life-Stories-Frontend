import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css';



const StoryCard = ({ part }) => {

   // console.log('first stoy of card :', part.firstStory);

   const storyPreview = part.firstStory && part.firstStory.content
      ? part.firstStory.content.slice(0, 150) + (part.firstStory.content.length > 150 ? '...' : '')
      : 'No content available...';

   

   return (
      <Link to={`/story/${part.partNumber}`} className="story-card">
         <img src={part.randomImage || '/assets/images/Default-Story-Image.jpg'} 
            alt={part.title} 
            className="w-full h-48 object-cover"
         />

         <div className="p-4">
            <h3 className="part-number text-xl font-bold"> Part {part.partNumber}</h3>
            <p className="story-title"> {part.title}</p>
            <p className="mt-2 story-preview">{storyPreview}</p>
         </div>
      </Link>
   );
};


// const StoryCard = ({ story }) => {
//    const preview = story.content.split(' ').slice(0, 20).join(' ') + '...';

//    return (
//       <Link to={`/story/${story.id}`} className="story-card">
//          <img src={story.imageURL || '/assets/images/Default-Story-Image.jpg'} alt={story.title} className="w-full h-48 object-cover" />
//          <div className="p-4">
//             <h3 className="part-number text-xl font-bold"> Part {story.partNumber}</h3>
//             <p className="story-title"> {story.title}</p>
//             <p className="mt-2">{preview}</p>
//          </div>
//       </Link>
//    );
// };


export default StoryCard;