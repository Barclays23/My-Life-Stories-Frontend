import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/firebase';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import Moment from '../../components/Moment/Moment';

const Chapter = () => {
  const { bookId, chapterId } = useParams();
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [moments, setMoments] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { currentUser, isAdmin } = useContext(AuthContext);
  const [userAccess, setUserAccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Parse bookId and chapterId from URL
      const bookDocId = bookId.split('-').pop();
      const chapterDocId = chapterId.split('-').pop();

      // Fetch Book
      const bookDoc = await getDoc(doc(db, 'books', bookDocId));
      if (bookDoc.exists()) {
        setBook({ id: bookDoc.id, ...bookDoc.data() });
      }

      // Fetch Chapter
      const chapterDoc = await getDoc(doc(db, 'chapters', chapterDocId));
      if (chapterDoc.exists()) {
        setChapter({ id: chapterDoc.id, ...chapterDoc.data() });
      }

      // Fetch Moments
      const momentsSnapshot = await getDocs(collection(db, 'moments'));
      const momentsList = momentsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(moment => moment.chapterId === chapterDocId)
        .sort((a, b) => a.momentNumber - b.momentNumber);
      setMoments(momentsList);

      // Fetch All Chapters for Pagination
      const chaptersSnapshot = await getDocs(collection(db, 'chapters'));
      const chaptersList = chaptersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(ch => ch.bookId === bookDocId)
        .sort((a, b) => a.chapterNumber - b.chapterNumber);
      setChapters(chaptersList);

      // Fetch Comments
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      const commentsList = commentsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(comment => comment.chapterId === chapterDocId);
      setComments(commentsList);

      // Check User Access and Reading Progress
      if (isAdmin) {
        setUserAccess(true);
      } else if (currentUser) {
        const progressSnapshot = await getDocs(collection(db, 'readingProgress'));
        const userProgress = progressSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .find(prog => prog.userId === currentUser.uid && prog.bookId === bookDocId);
        setReadingProgress(userProgress);

        if (bookDoc.data().accessType === 'Paid') {
          const paymentSnapshot = await getDocs(collection(db, 'payments'));
          const hasPaid = paymentSnapshot.docs.some(doc =>
            doc.data().userId === currentUser.uid && doc.data().bookId === bookDocId && doc.data().status === 'completed'
          );
          if (!hasPaid) {
            toast.error('Please purchase this book to access full content.');
            setUserAccess(false);
            return;
          }
        }

        setUserAccess(true);
        const currentChapter = chaptersList.find(ch => ch.id === chapterDocId);
        if (userProgress) {
          const lastChapter = chaptersList.find(ch => ch.id === userProgress.lastReadChapterId);
          const lastChapterIndex = chaptersList.findIndex(ch => ch.id === lastChapter?.id);
          const currentChapterIndex = chaptersList.findIndex(ch => ch.id === chapterDocId);

          if (currentChapterIndex > lastChapterIndex + 1) {
            toast.error('You can only access the next chapter after completing the previous one.');
            setUserAccess(false);
            setPreviewMode(true);
          }
        } else if (currentChapter.chapterNumber !== 1) {
          toast.error('Please start from Chapter 1.');
          setUserAccess(false);
          setPreviewMode(true);
        }
      } else {
        setPreviewMode(true);
        toast.info('Please log in to read the full chapter.');
      }
    };

    fetchData();
  }, [bookId, chapterId, currentUser, isAdmin]);

  const handleAddMoment = () => {
    navigate(`/books/${bookId}/chapter/${chapterId}/add-moment`);
  };

  const handleDeleteMoment = async (momentId, momentNumber) => {
    try {
      await deleteDoc(doc(db, 'moments', momentId));
      const updatedMoments = moments
        .filter(moment => moment.id !== momentId)
        .map(moment => {
          if (moment.momentNumber > momentNumber) {
            return { ...moment, momentNumber: moment.momentNumber - 1 };
          }
          return moment;
        });
      setMoments(updatedMoments);
      toast.success('Moment deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete moment.');
      console.error(error);
    }
  };

  const handleNavigateChapter = (direction) => {
    const currentIndex = chapters.findIndex(ch => ch.id === chapterId.split('-').pop());
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < chapters.length) {
      const newChapter = chapters[newIndex];
      navigate(`/books/${bookId}/chapter/${newChapter.chapterTitle.toLowerCase().replace(/\s+/g, '-')}-${newChapter.id}`);
    }
  };

  const handleSubmitComment = async () => {
    if (!currentUser) {
      toast.error('Please log in to comment.');
      return;
    }

    if (!newComment) {
      toast.error('Please enter a comment.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        chapterId: chapterId.split('-').pop(),
        userId: currentUser.uid,
        commentText: newComment,
        adminReply: '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setComments([...comments, {
        id: docRef.id,
        chapterId: chapterId.split('-').pop(),
        userId: currentUser.uid,
        commentText: newComment,
        adminReply: ''
      }]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment.');
      console.error(error);
    }
  };

  const handleReplyComment = async (commentId, replyText) => {
    try {
      await updateDoc(doc(db, 'comments', commentId), {
        adminReply: replyText,
        updatedAt: new Date()
      });
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, adminReply: replyText } : comment
      ));
      toast.success('Reply added successfully!');
    } catch (error) {
      toast.error('Failed to reply to comment.');
      console.error(error);
    }
  };

  if (!book || !chapter) return <div>Loading...</div>;

  const previewContent = moments.length > 0 ? moments[0].content.slice(0, 100) + '...' : 'No moments available.';

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
      <h2 className="text-2xl font-bold mb-6">{chapter.chapterTitle}</h2>

      {previewMode && !userAccess ? (
        <div>
          <p>{previewContent}</p>
          <p className="text-red-600 mt-2">Please log in or purchase to read the full chapter.</p>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div className="mb-6">
              <button onClick={handleAddMoment} className="btn mb-4">Add Moment</button>
              <div className="flex justify-between">
                <select
                  onChange={(e) => {
                    const selectedChapter = chapters.find(ch => ch.id === e.target.value);
                    navigate(`/books/${bookId}/chapter/${selectedChapter.chapterTitle.toLowerCase().replace(/\s+/g, '-')}-${selectedChapter.id}`);
                  }}
                  value={chapterId.split('-').pop()}
                  className="input"
                >
                  {chapters.map(ch => (
                    <option key={ch.id} value={ch.id}>
                      {ch.chapterTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Moments List */}
          <div className="space-y-8">
            {moments.map(moment => (
              <Moment
                key={moment.id}
                moment={moment}
                isAdmin={isAdmin}
                onDelete={() => handleDeleteMoment(moment.id, moment.momentNumber)}
                onEdit={() => navigate(`/books/${bookId}/chapter/${chapterId}/edit-moment/${moment.id}`)}
              />
            ))}
          </div>

          {/* User Pagination */}
          {!isAdmin && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleNavigateChapter('prev')}
                disabled={chapters.findIndex(ch => ch.id === chapterId.split('-').pop()) === 0}
                className="btn disabled:opacity-50"
              >
                Previous Chapter
              </button>
              <button
                onClick={() => handleNavigateChapter('next')}
                disabled={
                  chapters.findIndex(ch => ch.id === chapterId.split('-').pop()) === chapters.length - 1 ||
                  !userAccess
                }
                className="btn disabled:opacity-50"
              >
                Next Chapter
              </button>
            </div>
          )}

          {/* Comments Section */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Comments</h2>
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <p>{comment.commentText}</p>
              {comment.adminReply && <p className="text-primary-color mt-2">Admin Reply: {comment.adminReply}</p>}
              {isAdmin && !comment.adminReply && (
                <div className="mt-2">
                  <textarea
                    placeholder="Reply to comment..."
                    className="input w-full mb-2"
                    rows="2"
                  />
                  <button
                    onClick={(e) => {
                      const replyText = e.target.previousSibling.value;
                      handleReplyComment(comment.id, replyText);
                    }}
                    className="btn"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
          {currentUser && (
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Add a Comment</h3>
              <textarea
                placeholder="Your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="input w-full mb-2"
                rows="3"
              />
              <button onClick={handleSubmitComment} className="btn">Submit Comment</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chapter;