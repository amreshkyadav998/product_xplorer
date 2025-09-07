import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Cache, Product } from '../../../../utils/db';

const CACHE_TTL = 3600000; // 1 hour

interface ProductsResponse {
  products: ProductDocument[];
  total: number;
  skip: number;
  limit: number;
}

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

    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const limit = parseInt((req.query.limit as string) || '100');
    const key = `category/${name}?limit=${limit}`;

    // Check cache
    const cached = await Cache.findOne({ key });
    if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
      return res.status(200).json(cached.value as ProductsResponse);
    }

    // Fetch from MongoDB
    const products = await Product.find({ category: name }).limit(limit);
    const responseData: ProductsResponse = { products, total: await Product.countDocuments({ category: name }), skip: 0, limit };

    // Cache the response
    await Cache.updateOne({ key }, { value: responseData, timestamp: new Date() }, { upsert: true });

    res.status(200).json(responseData);
  } catch (error: unknown) {
    console.error('API Error:', (error as Error).message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}