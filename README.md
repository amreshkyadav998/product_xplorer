# Product Showcase Explorer

A Next.js-based web application to showcase products fetched from DummyJSON and stored in MongoDB, with features like category filtering, sorting, and product details. Built with TypeScript, Tailwind CSS, Framer Motion animations, Lucide React icons, MongoDB caching, and deployed on Vercel at [https://product-xplorerr.vercel.app/](https://product-xplorerr.vercel.app/).

## 📖 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

The Product Showcase Explorer is a single-page application built with Next.js and TypeScript, utilizing MongoDB for data persistence with caching optimization. Features smooth animations with Framer Motion, clean icons from Lucide React, and responsive design with Tailwind CSS. It fetches product data from the DummyJSON API, seeds it into a MongoDB database, and provides an interactive UI with product listing, filtering, sorting, and modal-based details. This app is live at [https://product-xplorerr.vercel.app/](https://product-xplorerr.vercel.app/), deployed on Vercel.

## ✨ Features

- **Tech Stack**: Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide React, MongoDB with caching, Vercel deployment
- Display a grid of products with pagination and smooth animations
- Filter products by category using a dropdown with animated transitions
- Sort products by title or price (ascending/descending)
- View detailed product information in animated modals
- Responsive design with Tailwind CSS for desktop and mobile
- MongoDB caching mechanism to optimize API and database calls
- Clean, modern UI with Lucide React icons

## Prerequisites

- Node.js (v19.x)
- npm 
- MongoDB Atlas account
- Vercel account (for deployment)

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/amreshkyadav998/product_xplorer.git
cd product-showcase-explorer
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```text
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/productcache?retryWrites=true&w=majority
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

Replace `username`, `password`, and `cluster.mongodb.net` with your MongoDB Atlas credentials and cluster URL.
Ensure `retryWrites=true&w=majority` is included for reliability.

### MongoDB Setup

1. Create a MongoDB Atlas cluster.
2. Add your IP address to the network access list (or use `0.0.0.0/0` for development).
3. Generate a connection string and use it as the `MONGO_URI`.

## Usage

### Run Locally

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser to view the app.

### Interact with the Live App

Visit https://product-xplorerr.vercel.app/ to:

- Browse the product grid.
- Use the category dropdown to filter products.
- Select a sorting option from the sort dropdown.
- Click a product to view details in a modal.
- Navigate pages using the pagination controls.

## Development

### Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the production version.

### File Structure

```text
product-showcase-explorer/
├── src/
│   ├── pages/              # Next.js pages (e.g., index.tsx)
│   ├── components/         # React components (e.g., ProductCard.tsx)
│   ├── types/              # TypeScript interfaces (e.g., product.ts)
│   ├── utils/              # Utilities (e.g., db.ts)
│   └── pages/api/          # API routes (e.g., products/index.ts)
├── .env.local              # Environment variables
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

### Adding Features

1. Extend `src/types/product.ts` to add new product fields.
2. Update `src/components/ProductCard.tsx` to display new fields.
3. Modify `src/pages/api/products/index.ts` for new API logic.

## Deployment

### Deploy to Vercel

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Log in to Vercel:

```bash
vercel login
```

3. Deploy the app:

```bash
vercel
```

4. Set environment variables in the Vercel dashboard:
   - Go to Project Settings > Environment Variables.
   - Add `MONGO_URI` with your MongoDB connection string.

5. Visit https://product-xplorerr.vercel.app/ to access the deployed app.

## Troubleshooting

### HTTP 500: "Failed to fetch products"

**Cause:** MongoDB connection timeout or misconfiguration after deployment on Vercel.

**Fix:**
- Ensure `MONGO_URI` is correctly set in the Vercel dashboard (Project Settings > Environment Variables).
- Allow all IPs (`0.0.0.0/0`) in MongoDB Atlas Network Access.
- Check Vercel logs for `MongoServerSelectionError` and adjust `serverSelectionTimeoutMS` in `src/utils/db.ts` (e.g., increase to 10000ms).
- Implement connection caching in `src/utils/db.ts` using the global cache pattern.

### Products Not Displaying

**Cause:** Empty MongoDB collection or caching issue on https://product-xplorerr.vercel.app/.

**Fix:**
- Seed data by triggering `/api/products` manually (e.g., visit https://product-xplorerr.vercel.app/api/products?limit=10).
- Clear the cache in MongoDB (`db.Cache.deleteMany({})`) via Atlas.

### Slow Performance

**Cause:** Cold starts or unoptimized queries on Vercel.

**Fix:**
- Use connection caching in `src/utils/db.ts`.
- Upgrade to Vercel Pro plan for longer timeouts (60s) if needed.
