import mongoose from 'mongoose';

let cachedConnection: mongoose.Connection | null = null;

export async function connectDB() {
  if (cachedConnection) return cachedConnection;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000, // optional, keeps your timeout
    });
    cachedConnection = conn.connection;
    console.log('MongoDB connected successfully');
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
}

// Cache Schema for temporary storage
const cacheSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
});
export const Cache =
  mongoose.models.Cache || mongoose.model('Cache', cacheSchema);

// Product Schema for permanent storage
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPercentage: { type: Number },
  rating: { type: Number },
  stock: { type: Number },
  brand: { type: String },
  category: { type: String, required: true },
  thumbnail: { type: String },
  images: { type: [String] },
  createdAt: { type: Date, default: Date.now },
});
export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
