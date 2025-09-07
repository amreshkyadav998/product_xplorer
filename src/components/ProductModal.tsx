import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { XIcon } from '@heroicons/react/outline';
import { Product } from '../types/product';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 relative overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
            <XIcon className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Image src={product.images[0]} alt={product.title} width={300} height={300} className="rounded mx-auto" />
              <div className="flex mt-2 space-x-2 justify-center">
                {product.images.slice(1).map((img, idx) => (
                  <Image key={idx} src={img} alt={`${product.title} ${idx}`} width={80} height={80} className="rounded" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="font-semibold">Price: ${product.price.toFixed(2)}</p>
              <p>Rating: {product.rating} / 5</p>
              <p>Stock: {product.stock}</p>
              <p>Brand: {product.brand}</p>
              <p>Category: {product.category}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;