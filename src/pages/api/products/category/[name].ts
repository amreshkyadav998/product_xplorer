// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';
// import { connectDB, Cache } from '../../../../utils/db';

// const CACHE_TTL = 3600000; // 1 hour

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectDB();

//   const { name } = req.query;
//   const { limit = '100' } = req.query; // Default to 100
//   const key = `https://dummyjson.com/products/category/${name}?limit=${limit}`;

//   try {
//     const cached = await Cache.findOne({ key });
//     if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
//       return res.json(cached.value);
//     }

//     const response = await axios.get(`https://dummyjson.com/products/category/${name}?limit=${limit}`);
//     const data = response.data;

//     await Cache.updateOne({ key }, { value: data, timestamp: new Date() }, { upsert: true });

//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch category data' });
//   }
// }


import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, Cache, Product } from '../../../../utils/db';

const CACHE_TTL = 3600000; // 1 hour

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
      return res.status(200).json(cached.value);
    }

    // Fetch from MongoDB
    const products = await Product.find({ category: name }).limit(limit);
    const responseData = { products, total: await Product.countDocuments({ category: name }), skip: 0, limit };

    // Cache the response
    await Cache.updateOne({ key }, { value: responseData, timestamp: new Date() }, { upsert: true });

    res.status(200).json(responseData);
  } catch (error: any) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}