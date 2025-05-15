const PaymentsSchema = {
  _id: ObjectId,
  userId: ObjectId,
  bookId: ObjectId,
  amount: Number,
  status: String,                   // 'pending', 'completed', 'failed'
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: Date,
  updatedAt: Date
};