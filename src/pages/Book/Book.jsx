import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import StoryCard from '../components/StoryCard';

const Book = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const { isAdmin, currentUser } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      const bookDocId = bookId.split('-').pop();
      const bookDoc = await getDoc(doc(db, 'books', bookDocId));
      if (bookDoc.exists()) {
        setBook({ id: bookDoc.id, ...bookDoc.data() });
      }
    };

    const fetchChapters = async () => {
      const bookDocId = bookId.split('-').pop();
      const chaptersSnapshot = await getDocs(collection(db, 'chapters'));
      const chaptersList = chaptersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(chapter => chapter.bookId === bookDocId)
        .sort((a, b) => a.chapterNumber - b.chapterNumber);
      setChapters(chaptersList);
    };

    const fetchReviews = async () => {
      const bookDocId = bookId.split('-').pop();
      const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
      const reviewsList = reviewsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(review => review.bookId === bookDocId)
        .slice(0, 5);
      setReviews(reviewsList);
    };

    fetchBook();
    fetchChapters();
    fetchReviews();
  }, [bookId]);

  const handleAddChapter = async () => {
    if (!newChapterTitle) {
      toast.error('Please enter a chapter title.');
      return;
    }

    try {
      const bookDocId = bookId.split('-').pop();
      const newChapterNumber = chapters.length + 1;
      const docRef = await addDoc(collection(db, 'chapters'), {
        bookId: bookDocId,
        chapterTitle: newChapterTitle,
        chapterNumber: newChapterNumber,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setChapters([...chapters, {
        id: docRef.id,
        bookId: bookDocId,
        chapterTitle: newChapterTitle,
        chapterNumber: newChapterNumber,
        isPublished: false
      }]);
      setNewChapterTitle('');
      toast.success('Chapter added successfully!');
    } catch (error) {
      toast.error('Failed to add chapter.');
      console.error(error);
    }
  };

  const handleDeleteChapter = async (chapterId, chapterNumber) => {
    try {
      await deleteDoc(doc(db, 'chapters', chapterId));
      const updatedChapters = chapters
        .filter(chapter => chapter.id !== chapterId)
        .map(chapter => {
          if (chapter.chapterNumber > chapterNumber) {
            return { ...chapter, chapterNumber: chapter.chapterNumber - 1 };
          }
          return chapter;
        });
      setChapters(updatedChapters);
      toast.success('Chapter deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete chapter.');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    const publicationDate = prompt('Enter publication date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!publicationDate) return;

    const pubDate = new Date(publicationDate);
    const today = new Date();
    let releaseStatus = 'Draft';

    const daysDiff = (today - pubDate) / (1000 * 60 * 60 * 24);
    if (pubDate > today) {
      releaseStatus = 'Coming Soon';
    } else if (daysDiff <= 14) {
      releaseStatus = 'New Release';
    } else {
      releaseStatus = 'Published';
    }

    try {
      const bookDocId = bookId.split('-').pop();
      await updateDoc(doc(db, 'books', bookDocId), {
        isPublished: true,
        publicationDate: pubDate,
        releaseStatus,
        updatedAt: new Date()
      });
      setBook({ ...book, isPublished: true, publicationDate: pubDate, releaseStatus });
      toast.success('Book published successfully!');
    } catch (error) {
      toast.error('Failed to publish book.');
      console.error(error);
    }
  };

  const handleCancelPublish = async () => {
    try {
      const bookDocId = bookId.split('-').pop();
      await updateDoc(doc(db, 'books', bookDocId), {
        isPublished: false,
        releaseStatus: 'Draft',
        updatedAt: new Date()
      });
      setBook({ ...book, isPublished: false, releaseStatus: 'Draft' });
      toast.success('Publication cancelled successfully!');
    } catch (error) {
      toast.error('Failed to cancel publication.');
      console.error(error);
    }
  };

  const handlePayment = async () => {
    try {
      const bookDocId = bookId.split('-').pop();
      // Update https://your-backend-url/api/create-order instead of http://localhost:5000).
      const response = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: book.price * 100, currency: 'INR' })
      });
      const order = await response.json();

      const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: order.amount,
        currency: order.currency,
        name: 'My Stories',
        description: `Purchase of ${book.title}`,
        order_id: order.id,
        handler: async (response) => {
          const verifyResponse = await fetch('http://localhost:5000/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyResult = await verifyResponse.json();
          if (verifyResult.success) {
            await addDoc(collection(db, 'payments'), {
              userId: auth.currentUser.uid,
              bookId: bookDocId,
              amount: book.price,
              status: 'completed',
              razorpayOrderId: response.razorpay_order_id,
              // userId + '-' + bookId as the document ID
              razorpayPaymentId: response.razorpay_payment_id,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            toast.success('Payment successful! You can now access the book.');
            window.location.reload();
          } else {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          email: auth.currentUser.email,
          contact: auth.currentUser.phoneNumber || ''
        },
        theme: {
          color: '#dc2626'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to initiate payment.');
      console.error(error);
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUser) {
      toast.error('Please log in to submit a review.');
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5.');
      return;
    }

    try {
      const bookDocId = bookId.split('-').pop();
      const docRef = await addDoc(collection(db, 'reviews'), {
        bookId: bookDocId,
        userId: currentUser.uid,
        rating,
        reviewText,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setReviews([...reviews, {
        id: docRef.id,
        bookId: bookDocId,
        userId: currentUser.uid,
        rating,
        reviewText
      }].slice(0, 5));
      setRating(0);
      setReviewText('');

      const updatedReviews = await getDocs(collection(db, 'reviews'));
      const bookReviews = updatedReviews.docs
        .map(doc => doc.data())
        .filter(review => review.bookId === bookDocId);
      const ratingAverage = bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length;
      await updateDoc(doc(db, 'books', bookDocId), {
        ratingAverage,
        ratingCount: bookReviews.length,
        updatedAt: new Date()
      });
      setBook({ ...book, ratingAverage, ratingCount: bookReviews.length });
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review.');
      console.error(error);
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      {/* Hero Banner */}
      <div className="book-hero bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-8 flex flex-col md:flex-row items-center">
        <img
          src={book.coverImage || 'https://via.placeholder.com/200'}
          alt={book.title}
          className="w-48 h-64 object-cover rounded-md mr-6 mb-4 md:mb-0"
        />
        <div>
          <h1 className="text-4xl font-bold text-primary-color">{book.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{book.tagline}</p>
          <p className="mt-2">{book.blurb}</p>
          <p className="mt-2">Genres: {book.genre.join(', ')}</p>
          <p>Language: {book.language}</p>
          <p>Status: {book.releaseStatus}</p>
          <p>Access: {book.accessType === 'Free' ? 'Free' : `₹${book.price}`}</p>
          <p>Rating: {book.ratingAverage.toFixed(1)} ({book.ratingCount} reviews)</p>
          {book.accessType === 'Paid' && currentUser && !isAdmin && (
            <button
              onClick={handlePayment}
              className="btn bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              Purchase Book (₹{book.price})
            </button>
          )}
          {isAdmin && (
            <div className="mt-4">
              {book.isPublished ? (
                <button onClick={handleCancelPublish} className="btn bg-red-600 text-white px-4 py-2 rounded">
                  Cancel Publish
                </button>
              ) : (
                <button onClick={handlePublish} className="btn bg-green-600 text-white px-4 py-2 rounded">
                  Publish Book
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Chapter */}
      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Chapter</h2>
          <div className="flex items-center max-w-md">
            <input
              type="text"
              placeholder="Chapter Title"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              className="input flex-1 mr-2"
            />
            <button onClick={handleAddChapter} className="btn">Add Chapter</button>
          </div>
        </div>
      )}

      {/* Chapters List */}
      <h2 className="text-2xl font-bold mb-4">Chapters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map(chapter => (
          <div key={chapter.id} className="relative">
            <StoryCard
              story={{
                id: chapter.id,
                title: chapter.chapterTitle,
                content: `Chapter ${chapter.chapterNumber}`
              }}
              onClick={() => navigate(`/books/${bookId}/chapter/${chapter.chapterTitle.toLowerCase().replace(/\s+/g, '-')}-${chapter.id}`)}
            />
            {isAdmin && (
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => navigate(`/books/${bookId}/edit-chapter/${chapter.id}`)}
                  className="btn bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteChapter(chapter.id, chapter.chapterNumber)}
                  className="btn bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Reviews</h2>
      {reviews.map(review => (
        <div key={review.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <p>Rating: {review.rating}/5</p>
          <p>{review.reviewText}</p>
        </div>
      ))}
      {currentUser && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Write a Review</h3>
          <div className="flex items-center mb-2">
            <label className="mr-2">Rating (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="input w-16"
            />
          </div>
          <textarea
            placeholder="Your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="input w-full mb-2"
            rows="3"
          />
          <button onClick={handleSubmitReview} className="btn">Submit Review</button>
        </div>
      )}
    </div>
  );
};

export default Book;