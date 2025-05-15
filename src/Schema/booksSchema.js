const BooksSchema = {
  _id: ObjectId,                    // Auto-generated
  title: String,                    // e.g., "Brocamp Life Stories"
  englishTitle: String,             // for friendly URL paths if using malayalam converted title as paths. eg: stories/ente-katha
  tagline: String,                  // Optional, e.g., "From Gold to Code"
  blurb: String,                    // Summary, e.g., "A journey through coding adventures"
  coverImage: String,               // URL or file path for the cover image
  genre: [String],                  // e.g., ["Memoir", "Education"], options: ["Memoir", "Fiction", "Non-Fiction", "Sports", "Romance", "Spiritual", "Articles"]
  language: String,                 // Options: ["English", "Malayalam"]
  releaseStatus: String,            // Options: ["Draft", "Coming Soon", "New Release", "Published", "Temporarily Unavailable"]
  publicationDate: Date,            // Set when publishing
  accessType: String,               // Options: ["Free", "Paid"] (Premium/Subscription to be implemented later)
  price: Number,                    // 0 if free, otherwise the price in INR (e.g., 299)
  isPublished: Boolean,             // Default: false for new books
  viewCount: Number,                // Default: 0
  ratingAverage: Number,            // Default: 0, updated via aggregation
  ratingCount: Number,              // Default: 0
  createdAt: Date,                  // Auto-set on creation
  updatedAt: Date                   // Updated when book, chapters, or moments are modified
};