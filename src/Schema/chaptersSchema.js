const ChaptersSchema = {
  _id: ObjectId,
  bookId: ObjectId,                 // Reference to Books
  chapterTitle: String,             // e.g., "Chapter 1: The Beginning"
  englishTitle: String,
  chapterNumber: Number,            // 1, 2, 3... (auto-managed)
  isPublished: Boolean,             // Default: false
  createdAt: Date,
  updatedAt: Date
};