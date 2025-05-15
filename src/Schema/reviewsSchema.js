const ReviewsSchema = {
  _id: ObjectId,
  bookId: ObjectId,
  userId: ObjectId,
  rating: Number,                   // 1 to 5
  reviewText: String,
  createdAt: Date,
  updatedAt: Date
};