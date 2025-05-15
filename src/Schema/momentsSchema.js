const MomentsSchema = {
  _id: ObjectId,
  chapterId: ObjectId,              // Reference to Chapters
  momentTitle: String,              // e.g., "Moment 1: First Day"
  content: String,                  // Story content (plain text or markdown)
  momentNumber: Number,             // 1, 2, 3... (auto-managed)
  isPublished: Boolean,             // Default: false
  createdAt: Date,
  updatedAt: Date
};