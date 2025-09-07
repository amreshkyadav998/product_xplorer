import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { connectDB, Cache, Product } from '../../../utils/db';

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

    const limit = parseInt((req.query.limit as string) || '100');
    const key = `products?limit=${limit}`;

    // Check cache
    const cached = await Cache.findOne({ key });
    if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
      return res.status(200).json(cached.value as ProductsResponse);
    }

    // Seed data from DummyJSON if the Product collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const response = await axios.get<ProductsResponse>('https://dummyjson.com/products?limit=100', {
        timeout: 30000,
      });
      const data = response.data;
      await Product.insertMany(data.products.map((p: ProductDocument) => ({
        ...p,
        category: p.category || 'uncategorized',
      })));
      console.log('Seeded', data.products.length, 'products into MongoDB');
    }

    // Fetch all products from MongoDB
    const products = await Product.find().limit(limit);
    const responseData: ProductsResponse = { products, total: await Product.countDocuments(), skip: 0, limit };

    // Cache the response
    await Cache.updateOne({ key }, { value: responseData, timestamp: new Date() }, { upsert: true });

    res.status(200).json(responseData);
  } catch (error: unknown) { // Changed to unknown for better typing
    console.error('API Error:', (error as Error).message);
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
    res.status(504).json({ error: 'Request timeout' });
  } else {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
  }
}