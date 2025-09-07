import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { XIcon, StarIcon } from "@heroicons/react/outline";
import { Product } from "../types/product";

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
        className="fixed inset-0 flex items-center justify-center z-50"
        onClick={onClose}
        style={{
          backgroundColor: "#0a0a0a", // dark base
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(255,255,255,0.12), transparent 300px),
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 40px 40px, 40px 40px", // spotlight + grid
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 30 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white border border-gray-500 max-w-3xl w-full m-4 relative overflow-y-auto max-h-[90vh] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 border border-gray-500 p-1 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            <XIcon className="h-5 w-5 text-gray-700" />
          </button>

          {/* Header */}
          <h2 className="text-2xl font-semibold mb-6 text-indigo-600 border-b border-gray-300 pb-3">
            {product.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div>
              <Image
                src={product.images[0]}
                alt={product.title}
                width={400}
                height={400}
                className="mx-auto border border-gray-300"
              />
              <div className="flex mt-3 space-x-2 justify-center">
                {product.images.slice(1).map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`${product.title} ${idx}`}
                    width={80}
                    height={80}
                    className="border border-gray-300 hover:opacity-80 transition cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-gray-800">
              <p className="text-sm leading-relaxed">{product.description}</p>

              <p className="text-lg font-medium text-emerald-600">
                ${product.price.toFixed(2)}
              </p>

              {/* Rating with stars */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating.toFixed(1)} / 5
                </span>
              </div>

              <p className="text-sm text-gray-700">
                Stock:{" "}
                <span
                  className={product.stock > 0 ? "text-black" : "text-red-600"}
                >
                  {product.stock > 0 ? product.stock : "Out of Stock"}
                </span>
              </p>

              <p className="text-sm text-gray-700">
                Brand: <span className="font-medium">{product.brand}</span>
              </p>

              <span className="inline-block border border-indigo-400 text-indigo-600 text-xs font-medium px-3 py-1">
                {product.category}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
