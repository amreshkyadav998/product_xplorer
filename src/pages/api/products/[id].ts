import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Cache, Product } from '../../../utils/db';

const CACHE_TTL = 3600000; // 1 hour

interface ProductDocument {
  id: number;
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  images?: string[];
  createdAt?: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const key = `product/${id}`;

    // Check cache
    const cached = await Cache.findOne({ key });
    if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
      return res.status(200).json(cached.value as ProductDocument);
    }

    // Fetch from MongoDB
    const product = await Product.findOne({ id: parseInt(id) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cache the response
    await Cache.updateOne({ key }, { value: product, timestamp: new Date() }, { upsert: true });

    res.status(200).json(product);
  } catch (error: unknown) {
    console.error('API Error:', (error as Error).message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}