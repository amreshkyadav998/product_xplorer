// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';
// import { connectDB, Cache } from '../../../utils/db';

// const CACHE_TTL = 3600000; // 1 hour

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectDB();

//   const { query } = req;
//   const params = new URLSearchParams(query as Record<string, string>).toString();
//   const apiPath = `/products${params ? `?${params}` : ''}`;
//   const key = `https://dummyjson.com${apiPath}`;

//   try {
//     const cached = await Cache.findOne({ key });
//     if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
//       return res.json(cached.value);
//     }

//     const response = await axios.get(`https://dummyjson.com${apiPath}`);
//     const data = response.data;

//     await Cache.updateOne({ key }, { value: data, timestamp: new Date() }, { upsert: true });

//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// }




// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';
// import { connectDB, Cache, Product } from '../../../utils/db';

// const CACHE_TTL = 3600000; // 1 hour

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     await connectDB();

//     const limit = (req.query.limit as string) || '100';
//     const key = `https://dummyjson.com/products?limit=${limit}`;

//     // Check cache
//     const cached = await Cache.findOne({ key });
//     if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
//       return res.status(200).json(cached.value);
//     }

//     // Fetch from DummyJSON
//     const response = await axios.get(`https://dummyjson.com/products?limit=${limit}`, {
//       timeout: 30000,
//     });
//     const data = response.data;

//     // Save all products to the Product collection
//     await Product.deleteMany({}); // Optional: Clear existing data to avoid duplicates
//     await Product.insertMany(data.products.map((p: any) => ({
//       ...p,
//       category: p.category || 'uncategorized', // Ensure category exists
//     })));

//     // Cache the response
//     await Cache.updateOne({ key }, { value: data, timestamp: new Date() }, { upsert: true });

//     res.status(200).json(data);
//   } catch (error: any) {
//     console.error('API Error:', error.message);
//     if (error.code === 'ECONNABORTED') {
//       res.status(504).json({ error: 'Request timeout' });
//     } else {
//       res.status(500).json({ error: 'Failed to fetch products' });
//     }
//   }
// }



import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { connectDB, Cache, Product } from '../../../utils/db';

const CACHE_TTL = 3600000; // 1 hour

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    const limit = parseInt((req.query.limit as string) || '100');
    const key = `products?limit=${limit}`;

    // Check cache
    const cached = await Cache.findOne({ key });
    if (cached && Date.now() - new Date(cached.timestamp).getTime() < CACHE_TTL) {
      return res.status(200).json(cached.value);
    }

    // Seed data from DummyJSON if the Product collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const response = await axios.get('https://dummyjson.com/products?limit=100', {
        timeout: 30000,
      });
      const data = response.data;
      await Product.insertMany(data.products.map((p: any) => ({
        ...p,
        category: p.category || 'uncategorized',
      })));
      console.log('Seeded', data.products.length, 'products into MongoDB');
    }

    // Fetch all products from MongoDB
    const products = await Product.find().limit(limit);
    const responseData = { products, total: await Product.countDocuments(), skip: 0, limit };

    // Cache the response
    await Cache.updateOne({ key }, { value: responseData, timestamp: new Date() }, { upsert: true });

    res.status(200).json(responseData);
  } catch (error: any) {
    console.error('API Error:', error.message);
    if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Request timeout' });
    } else {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
}