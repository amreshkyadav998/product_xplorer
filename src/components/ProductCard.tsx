import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          onLoadingComplete={() => setImgError(false)}
        />
        {imgError && (
          <div className="text-gray-500 text-sm">Image not available</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;