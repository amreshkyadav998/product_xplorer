import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { connectDB, Cache } from '../../../utils/db';

const CACHE_TTL = 3600000; // 1 hour

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const key = 'https://dummyjson.com/products/categories';

  try {
    const cached = await Cache.findOne({ key });
    if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
      return res.json(cached.value);
    }

    const response = await axios.get('https://dummyjson.com/products/categories');
    const data = response.data;

    await Cache.updateOne({ key }, { value: data, timestamp: new Date() }, { upsert: true });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}