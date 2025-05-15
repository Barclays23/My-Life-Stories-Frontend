import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const CreateBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    blurb: '',
    coverImage: '',
    genre: [],
    language: 'English',
    releaseStatus: 'Draft',
    accessType: 'Free',
    price: 0,
    isPublished: false,
    viewCount: 0,
    ratingAverage: 0,
    ratingCount: 0
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, genre: [...formData.genre, value] });
    } else {
      setFormData({ ...formData, genre: formData.genre.filter(g => g !== value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'books'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success('Book created successfully!');
      navigate(`/book/${docRef.id}`);
    } catch (error) {
      toast.error('Failed to create book.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Create a New Book</h2>
      <div className="max-w-md mx-auto">
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="tagline"
            placeholder="Tagline (Optional)"
            value={formData.tagline}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <textarea
            name="blurb"
            placeholder="Blurb/Summary"
            value={formData.blurb}
            onChange={handleChange}
            className="input"
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="coverImage"
            placeholder="Cover Image URL"
            value={formData.coverImage}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="block mb-1">Genre (Select all that apply)</label>
          {["Memoir", "Fiction", "Non-Fiction", "Sports", "Romance", "Spiritual", "Articles"].map(genre => (
            <label key={genre} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value={genre}
                onChange={handleGenreChange}
                className="mr-1"
              />
              {genre}
            </label>
          ))}
        </div>
        <div className="form-group">
          <label className="block mb-1">Language</label>
          <select name="language" value={formData.language} onChange={handleChange} className="input">
            <option value="English">English</option>
            <option value="Malayalam">Malayalam</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block mb-1">Access Type</label>
          <select name="accessType" value={formData.accessType} onChange={handleChange} className="input">
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        {formData.accessType === 'Paid' && (
          <div className="form-group">
            <input
              type="number"
              name="price"
              placeholder="Price (INR)"
              value={formData.price}
              onChange={handleChange}
              className="input"
              min="0"
              required
            />
          </div>
        )}
        <button onClick={handleSubmit} className="btn">Create Book</button>
      </div>
    </div>
  );
};

export default CreateBook;