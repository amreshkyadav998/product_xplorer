// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Navbar from '../components/Navbar';
// import ProductCard from '../components/ProductCard';
// import ProductModal from '../components/ProductModal';
// import SkeletonCard from '../components/SkeletonCard';
// import { Product, ProductsResponse } from '../types/product';
// import { Listbox } from '@headlessui/react';

// // Define the category interface based on the provided JSON
// interface Category {
//   slug: string;
//   name: string;
//   url: string;
// }

// const Home = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [sortOption, setSortOption] = useState<string>('title-asc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//   const perPage = 12;

//   // Use the provided category list directly
//   useEffect(() => {
//     // Hardcode the categories from the provided JSON
//     const categoryList: Category[] = [
//       { slug: "beauty", name: "Beauty", url: "https://dummyjson.com/products/category/beauty" },
//       { slug: "fragrances", name: "Fragrances", url: "https://dummyjson.com/products/category/fragrances" },
//       { slug: "furniture", name: "Furniture", url: "https://dummyjson.com/products/category/furniture" },
//       { slug: "groceries", name: "Groceries", url: "https://dummyjson.com/products/category/groceries" },
//       { slug: "home-decoration", name: "Home Decoration", url: "https://dummyjson.com/products/category/home-decoration" },
//       { slug: "kitchen-accessories", name: "Kitchen Accessories", url: "https://dummyjson.com/products/category/kitchen-accessories" },
//       { slug: "laptops", name: "Laptops", url: "https://dummyjson.com/products/category/laptops" },
//       { slug: "mens-shirts", name: "Mens Shirts", url: "https://dummyjson.com/products/category/mens-shirts" },
//       { slug: "mens-shoes", name: "Mens Shoes", url: "https://dummyjson.com/products/category/mens-shoes" },
//       { slug: "mens-watches", name: "Mens Watches", url: "https://dummyjson.com/products/category/mens-watches" },
//       { slug: "mobile-accessories", name: "Mobile Accessories", url: "https://dummyjson.com/products/category/mobile-accessories" },
//       { slug: "motorcycle", name: "Motorcycle", url: "https://dummyjson.com/products/category/motorcycle" },
//       { slug: "skin-care", name: "Skin Care", url: "https://dummyjson.com/products/category/skin-care" },
//       { slug: "smartphones", name: "Smartphones", url: "https://dummyjson.com/products/category/smartphones" },
//       { slug: "sports-accessories", name: "Sports Accessories", url: "https://dummyjson.com/products/category/sports-accessories" },
//       { slug: "sunglasses", name: "Sunglasses", url: "https://dummyjson.com/products/category/sunglasses" },
//       { slug: "tablets", name: "Tablets", url: "https://dummyjson.com/products/category/tablets" },
//       { slug: "tops", name: "Tops", url: "https://dummyjson.com/products/category/tops" },
//       { slug: "vehicle", name: "Vehicle", url: "https://dummyjson.com/products/category/vehicle" },
//       { slug: "womens-bags", name: "Womens Bags", url: "https://dummyjson.com/products/category/womens-bags" },
//       { slug: "womens-dresses", name: "Womens Dresses", url: "https://dummyjson.com/products/category/womens-dresses" },
//       { slug: "womens-jewellery", name: "Womens Jewellery", url: "https://dummyjson.com/products/category/womens-jewellery" },
//       { slug: "womens-shoes", name: "Womens Shoes", url: "https://dummyjson.com/products/category/womens-shoes" },
//       { slug: "womens-watches", name: "Womens Watches", url: "https://dummyjson.com/products/category/womens-watches" },
//     ];
//     setCategories(categoryList);
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const url = selectedCategory
//         ? `/api/products/category/${encodeURIComponent(selectedCategory)}?limit=100`
//         : `/api/products?limit=100`;
//       const res = await fetch(url);
//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}: Failed to fetch products`);
//       }
//       const data: ProductsResponse = await res.json();
//       setProducts(data.products);
//       if (data.products.length === 0 && selectedCategory) {
//         setError(`No products found in category "${categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}". Try another.`);
//       }
//       setCurrentPage(1);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load products. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProductDetail = async (id: number) => {
//     try {
//       const res = await fetch(`/api/products/${id}`);
//       if (!res.ok) throw new Error('Failed to fetch product detail');
//       const data: Product = await res.json();
//       setSelectedProduct(data);
//     } catch (err) {
//       setError('Failed to load product details');
//     }
//   };

//   const sortProducts = (prods: Product[]) => {
//     return [...prods].sort((a, b) => {
//       switch (sortOption) {
//         case 'price-asc':
//           return a.price - b.price;
//         case 'price-desc':
//           return b.price - a.price;
//         case 'title-asc':
//           return a.title.localeCompare(b.title);
//         case 'title-desc':
//           return b.title.localeCompare(a.title);
//         default:
//           return 0;
//       }
//     });
//   };

//   const sortedProducts = sortProducts(products);
//   const totalPages = Math.ceil(sortedProducts.length / perPage);
//   const currentProducts = sortedProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleProductClick = (product: Product) => {
//     fetchProductDetail(product.id);
//   };

//   const sortOptions = [
//     { value: 'title-asc', label: 'Title A-Z' },
//     { value: 'title-desc', label: 'Title Z-A' },
//     { value: 'price-asc', label: 'Price Low to High' },
//     { value: 'price-desc', label: 'Price High to Low' },
//   ];

//   if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
//           <Listbox value={selectedCategory} onChange={setSelectedCategory} as="div" className="relative w-full md:w-auto">
//             <Listbox.Button className="bg-white border border-gray-300 rounded px-4 py-2 w-full">
//               {selectedCategory ? categories.find(cat => cat.slug === selectedCategory)?.name : 'All Categories'}
//             </Listbox.Button>
//             <Listbox.Options className="absolute bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto z-10 w-full">
//               <Listbox.Option
//                 key="all"
//                 value={null}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//               >
//                 All Categories
//               </Listbox.Option>
//               {categories.map((category) => (
//                 <Listbox.Option
//                   key={category.slug}
//                   value={category.slug}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {category.name}
//                 </Listbox.Option>
//               ))}
//             </Listbox.Options>
//           </Listbox>
//           <Listbox value={sortOption} onChange={setSortOption} as="div" className="relative w-full md:w-auto">
//             <Listbox.Button className="bg-white border border-gray-300 rounded px-4 py-2 w-full">
//               {sortOptions.find((opt) => opt.value === sortOption)?.label}
//             </Listbox.Button>
//             <Listbox.Options className="absolute bg-white border border-gray-300 rounded mt-1 z-10 w-full">
//               {sortOptions.map((opt) => (
//                 <Listbox.Option
//                   key={opt.value}
//                   value={opt.value}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {opt.label}
//                 </Listbox.Option>
//               ))}
//             </Listbox.Options>
//           </Listbox>
//         </div>
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {Array.from({ length: perPage }).map((_, idx) => <SkeletonCard key={idx} />)}
//           </div>
//         ) : (
//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//             initial="hidden"
//             animate="visible"
//             variants={{
//               visible: { transition: { staggerChildren: 0.1 } },
//             }}
//           >
//             {currentProducts.map((product) => (
//               <motion.div
//                 key={product.id}
//                 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
//               >
//                 <ProductCard product={product} onClick={() => handleProductClick(product)} />
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//         <div className="flex justify-center mt-8 space-x-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
//           >
//             Previous
//           </button>
//           <span className="py-2">Page {currentPage} of {totalPages}</span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
//           >
//             Next
//           </button>
//         </div>
//       </main>
//       <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
//     </div>
//   );
// };

// export default Home;


// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Navbar from '../components/Navbar';
// import ProductCard from '../components/ProductCard';
// import ProductModal from '../components/ProductModal';
// import SkeletonCard from '../components/SkeletonCard';
// import { Product, ProductsResponse } from '../types/product';
// import { Listbox } from '@headlessui/react';

// interface Category {
//   slug: string;
//   name: string;
//   url: string;
// }

// const Home = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [sortOption, setSortOption] = useState<string>('title-asc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//   const perPage = 12;

//   useEffect(() => {
//     const categoryList: Category[] = [
//       { slug: "beauty", name: "Beauty", url: "https://dummyjson.com/products/category/beauty" },
//       { slug: "fragrances", name: "Fragrances", url: "https://dummyjson.com/products/category/fragrances" },
//       { slug: "furniture", name: "Furniture", url: "https://dummyjson.com/products/category/furniture" },
//       { slug: "groceries", name: "Groceries", url: "https://dummyjson.com/products/category/groceries" },
//       { slug: "home-decoration", name: "Home Decoration", url: "https://dummyjson.com/products/category/home-decoration" },
//       { slug: "kitchen-accessories", name: "Kitchen Accessories", url: "https://dummyjson.com/products/category/kitchen-accessories" },
//       { slug: "laptops", name: "Laptops", url: "https://dummyjson.com/products/category/laptops" },
//       { slug: "mens-shirts", name: "Mens Shirts", url: "https://dummyjson.com/products/category/mens-shirts" },
//       { slug: "mens-shoes", name: "Mens Shoes", url: "https://dummyjson.com/products/category/mens-shoes" },
//       { slug: "mens-watches", name: "Mens Watches", url: "https://dummyjson.com/products/category/mens-watches" },
//       { slug: "mobile-accessories", name: "Mobile Accessories", url: "https://dummyjson.com/products/category/mobile-accessories" },
//       { slug: "motorcycle", name: "Motorcycle", url: "https://dummyjson.com/products/category/motorcycle" },
//       { slug: "skin-care", name: "Skin Care", url: "https://dummyjson.com/products/category/skin-care" },
//       { slug: "smartphones", name: "Smartphones", url: "https://dummyjson.com/products/category/smartphones" },
//       { slug: "sports-accessories", name: "Sports Accessories", url: "https://dummyjson.com/products/category/sports-accessories" },
//       { slug: "sunglasses", name: "Sunglasses", url: "https://dummyjson.com/products/category/sunglasses" },
//       { slug: "tablets", name: "Tablets", url: "https://dummyjson.com/products/category/tablets" },
//       { slug: "tops", name: "Tops", url: "https://dummyjson.com/products/category/tops" },
//       { slug: "vehicle", name: "Vehicle", url: "https://dummyjson.com/products/category/vehicle" },
//       { slug: "womens-bags", name: "Womens Bags", url: "https://dummyjson.com/products/category/womens-bags" },
//       { slug: "womens-dresses", name: "Womens Dresses", url: "https://dummyjson.com/products/category/womens-dresses" },
//       { slug: "womens-jewellery", name: "Womens Jewellery", url: "https://dummyjson.com/products/category/womens-jewellery" },
//       { slug: "womens-shoes", name: "Womens Shoes", url: "https://dummyjson.com/products/category/womens-shoes" },
//       { slug: "womens-watches", name: "Womens Watches", url: "https://dummyjson.com/products/category/womens-watches" },
//     ];
//     setCategories(categoryList);
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const url = selectedCategory
//         ? `/api/products/category/${encodeURIComponent(selectedCategory)}?limit=100`
//         : `/api/products?limit=100`;
//       console.log('Fetching from:', url);
//       const res = await fetch(url);
//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}: ${await res.text()}`);
//       }
//       const data: ProductsResponse = await res.json();
//       setProducts(data.products);
//       if (data.products.length === 0 && selectedCategory) {
//         setError(`No products found in category "${categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}". Try another.`);
//       }
//       setCurrentPage(1);
//     } catch (err: any) {
//       console.error('Fetch error:', err.message);
//       setError(err.message || 'Failed to load products. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProductDetail = async (id: number) => {
//     try {
//       const res = await fetch(`/api/products/${id}`);
//       if (!res.ok) throw new Error('Failed to fetch product detail');
//       const data: Product = await res.json();
//       setSelectedProduct(data);
//     } catch (err) {
//       setError('Failed to load product details');
//     }
//   };

//   const sortProducts = (prods: Product[]) => {
//     return [...prods].sort((a, b) => {
//       switch (sortOption) {
//         case 'price-asc':
//           return a.price - b.price;
//         case 'price-desc':
//           return b.price - a.price;
//         case 'title-asc':
//           return a.title.localeCompare(b.title);
//         case 'title-desc':
//           return b.title.localeCompare(a.title);
//         default:
//           return 0;
//       }
//     });
//   };

//   const sortedProducts = sortProducts(products);
//   const totalPages = Math.ceil(sortedProducts.length / perPage);
//   const currentProducts = sortedProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleProductClick = (product: Product) => {
//     fetchProductDetail(product.id);
//   };

//   const sortOptions = [
//     { value: 'title-asc', label: 'Title A-Z' },
//     { value: 'title-desc', label: 'Title Z-A' },
//     { value: 'price-asc', label: 'Price Low to High' },
//     { value: 'price-desc', label: 'Price High to Low' },
//   ];

//   if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
//           <Listbox value={selectedCategory} onChange={setSelectedCategory} as="div" className="relative w-full md:w-auto">
//             <Listbox.Button className="bg-white border border-gray-300 rounded px-4 py-2 w-full">
//               {selectedCategory ? categories.find(cat => cat.slug === selectedCategory)?.name : 'All Categories'}
//             </Listbox.Button>
//             <Listbox.Options className="absolute bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto z-10 w-full">
//               <Listbox.Option
//                 key="all"
//                 value={null}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//               >
//                 All Categories
//               </Listbox.Option>
//               {categories.map((category) => (
//                 <Listbox.Option
//                   key={category.slug}
//                   value={category.slug}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {category.name}
//                 </Listbox.Option>
//               ))}
//             </Listbox.Options>
//           </Listbox>
//           <Listbox value={sortOption} onChange={setSortOption} as="div" className="relative w-full md:w-auto">
//             <Listbox.Button className="bg-white border border-gray-300 rounded px-4 py-2 w-full">
//               {sortOptions.find((opt) => opt.value === sortOption)?.label}
//             </Listbox.Button>
//             <Listbox.Options className="absolute bg-white border border-gray-300 rounded mt-1 z-10 w-full">
//               {sortOptions.map((opt) => (
//                 <Listbox.Option
//                   key={opt.value}
//                   value={opt.value}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {opt.label}
//                 </Listbox.Option>
//               ))}
//             </Listbox.Options>
//           </Listbox>
//         </div>
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {Array.from({ length: perPage }).map((_, idx) => <SkeletonCard key={idx} />)}
//           </div>
//         ) : (
//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//             initial="hidden"
//             animate="visible"
//             variants={{
//               visible: { transition: { staggerChildren: 0.1 } },
//             }}
//           >
//             {currentProducts.map((product) => (
//               <motion.div
//                 key={product.id}
//                 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
//               >
//                 <ProductCard product={product} onClick={() => handleProductClick(product)} />
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//         <div className="flex justify-center mt-8 space-x-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
//           >
//             Previous
//           </button>
//           <span className="py-2">Page {currentPage} of {totalPages}</span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
//           >
//             Next
//           </button>
//         </div>
//       </main>
//       <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
//     </div>
//   );
// };

// export default Home;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import SkeletonCard from '../components/SkeletonCard';
import { Product, ProductsResponse } from '../types/product';
import { Listbox } from '@headlessui/react';

interface Category {
  slug: string;
  name: string;
  url: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('title-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const perPage = 12;

  useEffect(() => {
    const categoryList: Category[] = [
      { slug: "beauty", name: "Beauty", url: "" },
      { slug: "fragrances", name: "Fragrances", url: "" },
      { slug: "furniture", name: "Furniture", url: "" },
      { slug: "groceries", name: "Groceries", url: "" },
      { slug: "home-decoration", name: "Home Decoration", url: "" },
      { slug: "kitchen-accessories", name: "Kitchen Accessories", url: "" },
      { slug: "laptops", name: "Laptops", url: "" },
      { slug: "mens-shirts", name: "Mens Shirts", url: "" },
      { slug: "mens-shoes", name: "Mens Shoes", url: "" },
      { slug: "mens-watches", name: "Mens Watches", url: "" },
      { slug: "mobile-accessories", name: "Mobile Accessories", url: "" },
      { slug: "motorcycle", name: "Motorcycle", url: "" },
      { slug: "skin-care", name: "Skin Care", url: "" },
      { slug: "smartphones", name: "Smartphones", url: "" },
      { slug: "sports-accessories", name: "Sports Accessories", url: "" },
      { slug: "sunglasses", name: "Sunglasses", url: "" },
      { slug: "tablets", name: "Tablets", url: "" },
      { slug: "tops", name: "Tops", url: "" },
      { slug: "vehicle", name: "Vehicle", url: "" },
      { slug: "womens-bags", name: "Womens Bags", url: "" },
      { slug: "womens-dresses", name: "Womens Dresses", url: "" },
      { slug: "womens-jewellery", name: "Womens Jewellery", url: "" },
      { slug: "womens-shoes", name: "Womens Shoes", url: "" },
      { slug: "womens-watches", name: "Womens Watches", url: "" },
    ];
    setCategories(categoryList);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCategory
        ? `/api/products/category/${encodeURIComponent(selectedCategory)}?limit=100`
        : `/api/products?limit=100`;
      console.log('Fetching from:', url);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }
      const data: ProductsResponse = await res.json();
      setProducts(data.products);
      if (data.products.length === 0 && selectedCategory) {
        setError(`No products found in category "${categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}". Try another.`);
      }
      setCurrentPage(1);
    } catch (err: any) {
      console.error('Fetch error:', err.message);
      setError(err.message || 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetail = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product detail');
      const data: Product = await res.json();
      setSelectedProduct(data);
    } catch (err) {
      setError('Failed to load product details');
    }
  };

  const sortProducts = (prods: Product[]) => {
    return [...prods].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };

  const sortedProducts = sortProducts(products);
  const totalPages = Math.ceil(sortedProducts.length / perPage);
  const currentProducts = sortedProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    fetchProductDetail(product.id);
  };

  const sortOptions = [
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'price-asc', label: 'Price Low to High' },
    { value: 'price-desc', label: 'Price High to Low' },
  ];

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <Listbox value={selectedCategory} onChange={setSelectedCategory} as="div" className="relative w-full md:w-auto">
            <Listbox.Button className="bg-white border border-gray-300 rounded px-4 py-2 w-full">
              {selectedCategory ? categories.find(cat => cat.slug === selectedCategory)?.name : 'All Categories'}
            </Listbox.Button>
            <Listbox.Options className="absolute bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto z-10 w-full">
              <Listbox.Option
                key="all"
                value={null}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                All Categories
              </Listbox.Option>
              {categories.map((category) => (
                <Listbox.Option
                  key={category.slug}
                  value={category.slug}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {category.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
          <Listbox value={sortOption} onChange={setSortOption} as="div" className="relative w-full md:w-auto">
            <Listbox.Button className="bg-white border border-gray-300 rounded px-4 py-2 w-full">
              {sortOptions.find((opt) => opt.value === sortOption)?.label}
            </Listbox.Button>
            <Listbox.Options className="absolute bg-white border border-gray-300 rounded mt-1 z-10 w-full">
              {sortOptions.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {opt.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: perPage }).map((_, idx) => <SkeletonCard key={idx} />)}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {currentProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <ProductCard product={product} onClick={() => handleProductClick(product)} />
              </motion.div>
            ))}
          </motion.div>
        )}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="py-2">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </main>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Home;