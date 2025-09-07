import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import SkeletonCard from "../components/SkeletonCard";
import { Product, ProductsResponse } from "../types/product";
import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { ChevronsUpDown } from "lucide-react"; 

interface Category {
  slug: string;
  name: string;
  url: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("title-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const perPage = 12;

  // Categories
  useEffect(() => {
    setCategories([
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
    ]);
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCategory
        ? `/api/products/category/${encodeURIComponent(selectedCategory)}?limit=100`
        : `/api/products?limit=100`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

      const data: ProductsResponse = await res.json();
      setProducts(data.products);

      if (data.products.length === 0 && selectedCategory) {
        const categoryName =
          categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory;
        setError(`No products found in "${categoryName}". Try another.`);
      }

      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Product detail
  const fetchProductDetail = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product detail");
      const data: Product = await res.json();
      setSelectedProduct(data);
    } catch {
      setError("Failed to load product details");
    }
  };

  // Sorting
  const sortProducts = (prods: Product[]) =>
    [...prods].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const sortedProducts = sortProducts(products);
  const totalPages = Math.ceil(sortedProducts.length / perPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (product: Product) => {
    fetchProductDetail(product.id);
  };

  const sortOptions = [
    { value: "title-asc", label: "Title A-Z" },
    { value: "title-desc", label: "Title Z-A" },
    { value: "price-asc", label: "Price Low → High" },
    { value: "price-desc", label: "Price High → Low" },
  ];

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-10 space-y-4 md:space-y-0 md:space-x-6">
          {/* Category dropdown */}
          <Listbox value={selectedCategory} onChange={setSelectedCategory} as="div" className="relative w-full md:w-1/3">
            <Listbox.Button className="flex justify-between items-center bg-white border border-gray-300 shadow-sm rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name
                : "All Categories"}
              <ChevronsUpDown className="h-5 w-5 text-gray-500" />
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 bg-white shadow-lg border border-gray-200 rounded-lg max-h-60 overflow-auto z-10 w-full">
              <Listbox.Option key="all" value={null} className="cursor-pointer select-none  px-4 py-2 hover:bg-indigo-50">
                All Categories
              </Listbox.Option>
              {categories.map((category) => (
                <Listbox.Option key={category.slug} value={category.slug} className="cursor-pointer select-none px-4 py-2 hover:bg-indigo-50">
                  {({ selected }) => (
                    <span className="flex items-center">
                      {selected && <CheckIcon className="h-4 w-4 text-indigo-600 mr-2" />}
                      {category.name}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>

          {/* Sort dropdown */}
          <Listbox value={sortOption} onChange={setSortOption} as="div" className="relative w-full md:w-1/3">
            <Listbox.Button className="flex justify-between items-center bg-white border border-gray-300 shadow-sm rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500">
              {sortOptions.find((opt) => opt.value === sortOption)?.label}
              <ChevronsUpDown className="h-5 w-5 text-gray-500" />
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 bg-white shadow-lg border border-gray-200 rounded-lg z-10 w-full">
              {sortOptions.map((opt) => (
                <Listbox.Option key={opt.value} value={opt.value} className="cursor-pointer select-none px-4 py-2 hover:bg-indigo-50">
                  {({ selected }) => (
                    <span className="flex items-center">
                      {selected && <CheckIcon className="h-4 w-4 text-indigo-600 mr-2" />}
                      {opt.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: perPage }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {currentProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="relative w-full h-full">
                  {/* Product card container with fixed height to keep uniform size */}
                  <div
                    onClick={() => handleProductClick(product)}
                    className="cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden relative flex flex-col"
                    style={{ minHeight: "260px" }} // adjust height as needed
                  >
                    <ProductCard product={product} />

                    {/* Small "View Details" icon at top-right */}
                    <button
                      onClick={() => handleProductClick(product)}
                      className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 hover:bg-indigo-100 transition"
                    >
                      <ChevronsUpDown className="h-5 w-5 text-indigo-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

          </motion.div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-10 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Previous
          </button>
          <span className="py-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
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
