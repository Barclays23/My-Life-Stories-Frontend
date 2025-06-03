const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { data } from 'react-router-dom';



// ATTACH THE TOKEN FOR ALL ADMIN ROUTE APIs
const attachToken = async () => {
  const currentUser = getAuth().currentUser;
  
  if (!currentUser) return {};

  const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
  return { headers: { Authorization: `Bearer ${idToken}` } };
};






const apiCalls = {

// ----------------------------------------------------------- HEROES COLLECTION APIs --------------
  // Fetch Heroes
  // getHeroes: async () => {
  //   const response = await fetch(`${API_URL}/heroes`);
  //   return response.json();
  // },
  getHeroes: async () => {
    const { data } = await axios.get(`${API_URL}/heroes`);
    return { data };
  },







// ----------------------------------------------------------- USERS COLLECTION APIs --------------
  signUp: async (formData) => {
    // const config = await attachToken();  // no need for signUp
    const response = await axios.post(`${API_URL}/register`, formData);
    return response.data;          // already JSON-parsed
  },

  // currently doing with Client SDK (Bcoz, cannot store the auth user data in authContext from Admin SDK)
  signIn: async (credentials) => {
    // const config = await attachToken();  // no need for signIn
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;          // already JSON-parsed
  },

  // currently doing with Client SDK (API function is not called)
  resetPassword: async (email) => {
    const response = await axios.post(`${API_URL}/reset-password`, { email });
    return response.data;
  },

  // PENDING - Fetch Users List
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },

  // PENDING - Get UserData / User Profile
  getUserProfile: async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  // PENDING - 
  updateUserProfile: async (token, data) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },







  // ----------------------------------------------------------- BOOKS COLLECTION APIs --------------
  getBooks: async () => {
    const { data } = await axios.get(`${API_URL}/books`);
    // console.log('random booksData :', data);
    return { data };
  },

  getRandomBooks: async () => {
    const { data } = await axios.get(`${API_URL}/random-books`);
    // console.log('booksList :', data);
    return { data };
  },

  getBooksList: async () => {
    const config = await attachToken();
    const { data } = await axios.get(`${API_URL}/admin/books`, config);
    // console.log('admin getBooksList :', data);
    return { data };
  },

  getBookDetails: async (bookId) => {
    // console.log('bookId in api :', bookId);    
    const config = await attachToken();
    const res = await axios.get(`${API_URL}/admin/book-details/${bookId}`, config);
    const bookData = res.data.bookData;
    // console.log('admin getBookDetails :', bookData);
    return { bookData };
  },

  createBook: async (formData) => {
    const config = await attachToken();
    const response = await axios.post(`${API_URL}/admin/create-book`, formData, config);
    // const data = await response.json();
    // return {data}
    return response.data;                   // already JSON-parsed
  },

  updateBook: async (bookId, formData) => {
    const config = await attachToken();
    const response = await axios.put(`${API_URL}/admin/update-book/${bookId}`, formData, config);
    // const data = await response.json();
    // return {data}
    return response.data;                   // already JSON-parsed
  },

  deleteBook: async (bookId, password) => {
    // console.log('bookId, password in api :', bookId, password);

    const config = await attachToken();
    const response = await axios.delete(
      `${API_URL}/admin/delete-book/${bookId}`,
      {
        data: { password },  // ← DELETE requests need the body under `data`
        ...config          // ← keeps the Authorization header
      }
    );

    // console.log('response data:', response.data);
    return response.data;
  },

  togglePublishBook: async (bookId, shouldPublish, publishDate) => {
    const config = await attachToken();
    // const data = axios.patch(`${API_URL}/admin/publish-book/${bookId}`, { shouldPublish, publishDate }, config);
    // return data
    console.log('ivide toggle publish ethi: ', bookId, shouldPublish, publishDate);
    
    const response = await axios.patch(`${API_URL}/admin/publish-book/${bookId}`, { shouldPublish, publishDate }, config);
    return response.data;
  },



  
  // ----------------------------------------------------------- CHAPTERS COLLECTION APIs --------------
  getChaptersByBook: async (bookId) => {
    const config = await attachToken();
    const response = await axios.get(`${API_URL}/admin/book-chapters/${bookId}`, config);
    return response.data;
  },
  
  createChapter: async ({bookId, chapterTitle}) => {
    // console.log('createChapter data in api :', bookId, chapterTitle);
    const config = await attachToken();
    const response = await axios.post(`${API_URL}/admin/add-chapter/${bookId}`, { chapterTitle}, config);

    return response.data;
  },

  updateChapter: async ({ bookId, chapterId, newChapterNumber, newChapterTitle }) => {
    // console.log('edit chapter data in API :', bookId, chapterId, newChapterNumber, newChapterTitle);
    
    const config = await attachToken();
    const res = await axios.put(
      `${API_URL}/admin/edit-chapter/${bookId}/${chapterId}`,
      { newChapterTitle, newChapterNumber },
      config
    );
    return res.data;
  },

  deleteChapter: async (bookId, chapterId, password) => {
    // console.log('deleteChapter data in api :', bookId, chapterId, password);
    const config = await attachToken();
    const response = await axios.delete(`${API_URL}/admin/delete-chapter/${bookId}/${chapterId}`,
      {
        data: { password },  // ← DELETE requests need the body under `data`
        ...config
      }
    )
    return response.data;
  },





  // ----------------------------------------------------------- MOMENTS COLLECTION APIs --------------
  getMomentsByChapter: async (bookId, chapterNumber) => {
    // console.log('bookId & chapterNumber in API :', bookId, '-', chapterNumber);
    
    const config = await attachToken();
    const res = await axios.get(`${API_URL}/admin/chapter-moments/${bookId}/${chapterNumber}`, config);
    return res.data;
  },

  createMoment: async (bookId, chapterId, formData) => {
    // console.log('data in createMoment:', formData.get('momentTitle'));
    const config = await attachToken();
    const res = await axios.post(`${API_URL}/admin/add-moment/${bookId}/${chapterId}`, formData, config);
    return res.data;
  },

  updateMoment: async (bookId, chapterId, momentId, formData) => {
    // console.log('formData in updateMoment API :', formData.get('updatedMomentTitle'));
    // console.log('bookId:',bookId, 'chapterId:',chapterId, 'momentId:',momentId);
    const config = await attachToken();
    const res = await axios.put(`${API_URL}/admin/edit-moment/${bookId}/${chapterId}/${momentId}`, formData, config);
    return res.data;
  },

  deleteMoment: async (bookId, chapterId, momentId, password) => {
    // console.log('data received in API :', 'bookId:',bookId, 'chapterId:',chapterId, 'momentId:',momentId, 'password:',password);
    
    const config = await attachToken();
    const res = await axios.delete(`${API_URL}/admin/delete-moment/${bookId}/${chapterId}/${momentId}`,
      {
        data: { password },  // ← DELETE requests need the body under `data`
        ...config
      }
    );

    return res.data;
  },







  // ----------------------------------------------------------- PAYMENTS COLLECTION APIs --------------
  createOrder: async (token, data) => {
    const response = await fetch(`${API_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  verifyPayment: async (token, data) => {
    const response = await fetch(`${API_URL}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export default apiCalls;