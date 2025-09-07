// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';
// import { connectDB, Cache } from '../../../utils/db';
// const CACHE_TTL = 3600000; // 1 hour

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectDB();

//   const { id } = req.query;
//   const key = `https://dummyjson.com/products/${id}`;

//   try {
//     const cached = await Cache.findOne({ key });
//     if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
//       return res.json(cached.value);
//     }

//     const response = await axios.get(`https://dummyjson.com/products/${id}`);
//     const data = response.data;

//     await Cache.updateOne({ key }, { value: data, timestamp: new Date() }, { upsert: true });

//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch product detail' });
//   }
// }




import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Cache, Product } from '../../../utils/db';

const CACHE_TTL = 3600000; // 1 hour

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
      return res.status(200).json(cached.value);
    }

    // Fetch from MongoDB
    const product = await Product.findOne({ id: parseInt(id) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cache the response
    await Cache.updateOne({ key }, { value: product, timestamp: new Date() }, { upsert: true });

    res.status(200).json(product);
  } catch (error: any) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}