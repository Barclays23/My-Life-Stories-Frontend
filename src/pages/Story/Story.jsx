import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { db, storage } from '../../firebase/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import LoadingSpinner2 from '../../components/Loading Spinner/LoadingSpinner2';
import './Story.css';

export const Story = () => {
   const { partNumber } = useParams();
   const navigate = useNavigate();
   const { currentUser } = useContext(AuthContext);
   const [part, setPart] = useState(null);
   const [stories, setStories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [editingPart, setEditingPart] = useState(null);
   const [editingStory, setEditingStory] = useState(null);
   const [newImage, setNewImage] = useState(null);
   const [removeImage, setRemoveImage] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            const partsSnapshot = await getDocs(collection(db, 'parts'));
            const partList = partsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const currentPart = partList.find(p => p.partNumber === parseInt(partNumber));
            if (!currentPart) {
               throw new Error('Part not found');
            }
            setPart(currentPart);

            const storiesSnapshot = await getDocs(collection(db, 'stories'));
            const storyList = storiesSnapshot.docs
               .map(doc => ({ id: doc.id, ...doc.data() }))
               .filter(s => s.partId === currentPart.partNumber)
               .sort((a, b) => a.serialNumber - b.serialNumber);
            setStories(storyList);

            await new Promise(resolve => setTimeout(resolve, 300));
         } catch (err) {
            toast.error(err.message);
            navigate('/stories');
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [partNumber, navigate]);

   const handleEditPart = () => {
      setEditingPart({ partNumber: part.partNumber, title: part.title });
   };

   const handleUpdatePart = async (e) => {
      e.preventDefault();
      try {
         setLoading(true);
         const newPartNumber = parseInt(editingPart.partNumber);
         if (isNaN(newPartNumber) || newPartNumber <= 0) {
            throw new Error('Part number must be a positive integer');
         }
         if (!editingPart.title) {
            throw new Error('Part title is required');
         }

         const partsSnapshot = await getDocs(collection(db, 'parts'));
         let allParts = partsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         const storiesSnapshot = await getDocs(collection(db, 'stories'));
         let allStories = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

         if (allParts.some(p => p.id !== part.id && p.partNumber === newPartNumber)) {
            throw new Error('Part number already exists');
         }

         if (newPartNumber !== part.partNumber) {
            const storiesToUpdate = allStories.filter(s => s.partId === part.partNumber);
            for (const story of storiesToUpdate) {
               await updateDoc(doc(db, 'stories', story.id), {
                  partId: newPartNumber,
               });
            }

            allParts = allParts.filter(p => p.id !== part.id);
            allParts.push({ id: part.id, partNumber: newPartNumber, title: editingPart.title });
            allParts.sort((a, b) => a.partNumber - b.partNumber);

            const updatedParts = allParts.map((p, index) => ({
               ...p,
               partNumber: index + 1,
            }));

            for (const p of updatedParts) {
               if (p.partNumber !== part.partNumber) {
                  const storiesForPart = allStories.filter(s => s.partId === p.partNumber && s.partId !== newPartNumber);
                  for (const story of storiesForPart) {
                     await updateDoc(doc(db, 'stories', story.id), {
                        partId: p.partNumber,
                     });
                  }
               }
               await updateDoc(doc(db, 'parts', p.id), {
                  partNumber: p.partNumber,
                  title: p.title,
               });
            }

            setPart({ ...part, partNumber: newPartNumber, title: editingPart.title });
            setStories(stories.map(s => ({ ...s, partId: newPartNumber })));
         } else {
            await updateDoc(doc(db, 'parts', part.id), {
               title: editingPart.title,
            });
            setPart({ ...part, title: editingPart.title });
         }

         await new Promise(resolve => setTimeout(resolve, 300));
         toast.success('Part updated successfully!');
         setEditingPart(null);
         navigate(`/story/${newPartNumber}`);
      } catch (err) {
         toast.error(err.message);
      } finally {
         setLoading(false);
      }
   };

   const handleDeletePart = async () => {
      try {
         setLoading(true);
         const storiesToDelete = stories;
         for (const story of storiesToDelete) {
            if (story.imageURL) {
               try {
                  const imagePath = decodeURIComponent(story.imageURL.split('/o/')[1].split('?')[0]);
                  const imageRef = ref(storage, imagePath);
                  await deleteObject(imageRef);
               } catch (err) {
                  console.warn('Failed to delete image from storage:', err.message);
               }
            }
            await deleteDoc(doc(db, 'stories', story.id));
         }

         await deleteDoc(doc(db, 'parts', part.id));

         const partsSnapshot = await getDocs(collection(db, 'parts'));
         let remainingParts = partsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.partNumber - b.partNumber);

         const storiesSnapshot = await getDocs(collection(db, 'stories'));
         let allStories = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

         for (let i = 0; i < remainingParts.length; i++) {
            const newPartNumber = i + 1;
            const storiesForPart = allStories.filter(s => s.partId === remainingParts[i].partNumber);
            for (const story of storiesForPart) {
               await updateDoc(doc(db, 'stories', story.id), {
                  partId: newPartNumber,
               });
            }
            await updateDoc(doc(db, 'parts', remainingParts[i].id), {
               partNumber: newPartNumber,
            });
         }

         await new Promise(resolve => setTimeout(resolve, 300));
         toast.success('Part and its stories deleted successfully!');
         navigate('/stories');
      } catch (err) {
         toast.error(err.message);
      } finally {
         setLoading(false);
      }
   };

   const handleEditStory = (story) => {
      setEditingStory({ ...story });
      setNewImage(null);
      setRemoveImage(false);
   };

   const handleImageChange = (e) => {
      if (e.target.files[0]) {
         setNewImage(e.target.files[0]);
         setRemoveImage(false);
      }
   };

   const handleRemoveImage = () => {
      setRemoveImage(true);
      setNewImage(null);
   };

   const handleUpdateStory = async (e, storyId) => {
      e.preventDefault();
      try {
         setLoading(true);
         const newSerialNumber = parseInt(editingStory.serialNumber);
         if (isNaN(newSerialNumber) || newSerialNumber <= 0) {
            throw new Error('Serial number must be a positive integer');
         }
         if (!editingStory.title || !editingStory.content) {
            throw new Error('Title and content are required');
         }

         if (stories.some(s => s.id !== storyId && s.serialNumber === newSerialNumber)) {
            throw new Error('Serial number already exists in this part');
         }

         let imageURL = editingStory.imageURL;
         if (removeImage) {
            if (editingStory.imageURL) {
               try {
                  const imagePath = decodeURIComponent(editingStory.imageURL.split('/o/')[1].split('?')[0]);
                  const imageRef = ref(storage, imagePath);
                  await deleteObject(imageRef);
               } catch (err) {
                  console.warn('Failed to delete image from storage:', err.message);
               }
            }
            imageURL = '';
         } else if (newImage) {
            const imageRef = ref(storage, `story-images/${storyId}-${Date.now()}`);
            await uploadBytes(imageRef, newImage);
            imageURL = await getDownloadURL(imageRef);
         }

         if (newSerialNumber !== editingStory.serialNumber) {
            let updatedStories = stories.filter(s => s.id !== storyId);
            updatedStories.push({ ...editingStory, serialNumber: newSerialNumber, imageURL });
            updatedStories.sort((a, b) => a.serialNumber - b.serialNumber);

            updatedStories = updatedStories.map((s, index) => ({
               ...s,
               serialNumber: index + 1,
            }));

            for (const s of updatedStories) {
               await updateDoc(doc(db, 'stories', s.id), {
                  serialNumber: s.serialNumber,
                  title: s.title,
                  content: s.content,
                  imageURL: s.imageURL || '',
               });
            }

            setStories(updatedStories);
         } else {
            await updateDoc(doc(db, 'stories', storyId), {
               serialNumber: newSerialNumber,
               title: editingStory.title,
               content: editingStory.content,
               imageURL: imageURL || '',
            });

            setStories(stories.map(s =>
               s.id === storyId
                  ? { ...s, serialNumber: newSerialNumber, title: editingStory.title, content: editingStory.content, imageURL: imageURL || '' }
                  : s
            ));
         }

         await new Promise(resolve => setTimeout(resolve, 300));
         toast.success('Story updated successfully!');
         setEditingStory(null);
         setNewImage(null);
         setRemoveImage(false);
      } catch (err) {
         toast.error(err.message);
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteStory = async (storyId) => {
      try {
         setLoading(true);
         const story = stories.find(s => s.id === storyId);
         if (story.imageURL) {
            try {
               const imagePath = decodeURIComponent(story.imageURL.split('/o/')[1].split('?')[0]);
               const imageRef = ref(storage, imagePath);
               await deleteObject(imageRef);
            } catch (err) {
               console.warn('Failed to delete image from storage:', err.message);
            }
         }

         await deleteDoc(doc(db, 'stories', storyId));

         let remainingStories = stories.filter(s => s.id !== storyId).sort((a, b) => a.serialNumber - b.serialNumber);
         remainingStories = remainingStories.map((s, index) => ({
            ...s,
            serialNumber: index + 1,
         }));

         for (const s of remainingStories) {
            await updateDoc(doc(db, 'stories', s.id), {
               serialNumber: s.serialNumber,
            });
         }

         setStories(remainingStories);
         await new Promise(resolve => setTimeout(resolve, 300));
         toast.success('Story deleted successfully!');
      } catch (err) {
         toast.error(err.message);
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return <LoadingSpinner2 />;
   }

   if (!part) {
      return null;
   }

   return (
      <div className="story mt-16">
         <div className="container mx-auto py-8 px-4">
            <header className="part-header mb-12">
               <div className="part-header-content">
                  <h2 className="part-title" lang="ml">
                     Part {part.partNumber}: {part.title}
                  </h2>
                  {currentUser && currentUser.isAdmin && (
                     <div className="admin-controls">
                        <button onClick={handleEditPart} className="btn btn-edit">Edit Part</button>
                        <button onClick={handleDeletePart} className="btn btn-delete">Delete Part</button>
                     </div>
                  )}
               </div>
            </header>

            {editingPart && (
               <div className="edit-part-form mb-12">
                  <div className="form-container">
                     <div className="form-group">
                        <label className="form-label">Part Number</label>
                        <input
                           type="number"
                           value={editingPart.partNumber}
                           onChange={e => setEditingPart({ ...editingPart, partNumber: e.target.value })}
                           className="form-input"
                           min="1"
                           required
                        />
                     </div>
                     <div className="form-group">
                        <label className="form-label">Part Title</label>
                        <input
                           type="text"
                           value={editingPart.title}
                           onChange={e => setEditingPart({ ...editingPart, title: e.target.value })}
                           className="form-input"
                           lang="ml"
                           required
                        />
                     </div>
                     <div className="form-actions">
                        <button type="submit" onClick={handleUpdatePart} className="btn btn-submit">Update Part</button>
                        <button type="button" onClick={() => setEditingPart(null)} className="btn btn-cancel">Cancel</button>
                     </div>
                  </div>
               </div>
            )}

            {stories.map(story => (
               <div key={story.id} className="story-section mb-12">
                  <h3 className="story-title" lang="ml">
                     {currentUser && currentUser.isAdmin ? `📘 ${story.serialNumber}: ${story.title}` : story.title}
                  </h3>
                  {editingStory?.id === story.id ? (
                     <div className="edit-story-form mt-4">
                        <div className="form-container">
                           <div className="form-group">
                              <label className="form-label">Serial Number</label>
                              <input
                                 type="number"
                                 value={editingStory.serialNumber}
                                 onChange={e => setEditingStory({ ...editingStory, serialNumber: e.target.value })}
                                 className="form-input"
                                 min="1"
                                 required
                              />
                           </div>
                           <div className="form-group">
                              <label className="form-label">Story Title</label>
                              <input
                                 type="text"
                                 value={editingStory.title}
                                 onChange={e => setEditingStory({ ...editingStory, title: e.target.value })}
                                 className="form-input"
                                 lang="ml"
                                 required
                              />
                           </div>
                           <div className="form-group">
                              <label className="form-label">Content</label>
                              <textarea
                                 value={editingStory.content}
                                 onChange={e => setEditingStory({ ...editingStory, content: e.target.value })}
                                 className="form-input form-textarea"
                                 lang="ml"
                                 required
                              />
                           </div>
                           <div className="form-group">
                              <label className="form-label">Image</label>
                              <div className="image-preview-wrapper">
                                 <img
                                    src={
                                       removeImage
                                          ? '/assets/images/Default-Story-Image.jpg'
                                          : newImage
                                          ? URL.createObjectURL(newImage)
                                          : editingStory.imageURL || '/assets/images/Default-Story-Image.jpg'
                                    }
                                    alt="Preview"
                                    className="image-preview"
                                 />
                                 {(!removeImage && (newImage || editingStory.imageURL)) && (
                                    <button
                                       type="button"
                                       onClick={handleRemoveImage}
                                       className="remove-image-btn"
                                       title="Remove Image"
                                    >
                                       ✕
                                    </button>
                                 )}
                              </div>
                              <div className="image-upload">
                                 {removeImage || (!newImage && !editingStory.imageURL) ? (
                                    <label className="btn btn-upload">
                                       Attach Image
                                       <input
                                          type="file"
                                          accept="image/*"
                                          onChange={handleImageChange}
                                          className="hidden"
                                       />
                                    </label>
                                 ) : (
                                    <input
                                       type="file"
                                       accept="image/*"
                                       onChange={handleImageChange}
                                       className="form-input-file"
                                    />
                                 )}
                              </div>
                           </div>
                           <div className="form-actions">
                              <button type="submit" onClick={e => handleUpdateStory(e, story.id)} className="btn btn-submit">Update Story</button>
                              <button
                                 type="button"
                                 onClick={() => { setEditingStory(null); setNewImage(null); setRemoveImage(false); }}
                                 className="btn btn-cancel"
                              >
                                 Cancel
                              </button>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="story-content-wrapper">
                        {story.imageURL && (
                           <img src={story.imageURL} alt={story.title} className="story-image" />
                        )}
                        <div className="story-text" lang="ml">
                           <p>{story.content}</p>
                           {currentUser && currentUser.isAdmin && (
                              <div className="story-actions">
                                 <button onClick={() => handleEditStory(story)} className="btn btn-edit">Edit Story</button>
                                 <button onClick={() => handleDeleteStory(story.id)} className="btn btn-delete">Delete Story</button>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
};

export default Story;