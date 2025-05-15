// Run once to migrate parts
import { db } from './firebase/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const migrateParts = async () => {
  const storiesSnapshot = await getDocs(collection(db, 'stories'));
  const stories = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const partNumbers = [...new Set(stories.map(s => Math.floor(s.partNumber)))].sort((a, b) => a - b);
  for (let i = 0; i < partNumbers.length; i++) {
    await addDoc(collection(db, 'parts'), {
      partNumber: i + 1,
      title: `Part ${i + 1}`, // Customize titles, e.g., "Freshman Year"
    });
  }
  console.log('Parts migrated');
};

// Run once to migrate stories
import { doc, setDoc } from 'firebase/firestore';

const migrateStories = async () => {
  const partsSnapshot = await getDocs(collection(db, 'parts'));
  const parts = partsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const storiesSnapshot = await getDocs(collection(db, 'stories'));
  const stories = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  for (const story of stories) {
    const part = parts.find(p => p.partNumber === Math.floor(story.partNumber));
    if (part) {
      await setDoc(doc(db, 'stories', story.id), {
        partId: part.partNumber,
        serialNumber: Math.round((story.partNumber % 1) * 10) || 1,
        title: story.title,
        content: story.content,
        imageURL: story.imageURL || '',
      });
    }
  }
  console.log('Stories migrated');
};

// Execute (run once, then remove or comment out)
migrateParts().then(() => migrateStories());