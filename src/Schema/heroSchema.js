const HeroSchema = {
  _id: ObjectId,
  title: String,                    // e.g., "Welcome to Brocamp Life Stories"
  subtitle: String,                 // e.g., "A Journey from Gold to Code"
  imageUrl: String,                 // URL of the hero image
  buttonText: String,               // e.g., "Explore Stories"
  buttonLink: String,               // e.g., "/stories"
  createdAt: Date,
  updatedAt: Date
};