const CommentsSchema = {
  _id: ObjectId,
  chapterId: ObjectId,
  userId: ObjectId,
  commentText: String,
  adminReply: String,               // Optional, added by admin
  createdAt: Date,
  updatedAt: Date
};