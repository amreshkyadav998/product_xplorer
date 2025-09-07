import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {MenuIcon, XIcon } from "@heroicons/react/outline";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Product Xplorer
          </h1>
        </motion.div>

        {/* Desktop Links */}
        <motion.ul
          className="hidden md:flex space-x-6 font-medium text-gray-600"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <li className="hover:text-indigo-600 cursor-pointer transition">Home</li>
          <li className="hover:text-indigo-600 cursor-pointer transition">Products</li>
          <li className="hover:text-indigo-600 cursor-pointer transition">About</li>
          <li className="hover:text-indigo-600 cursor-pointer transition">Contact</li>
        </motion.ul>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <MenuIcon className="w-6 h-6 text-gray-700" />
          )}
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-50 shadow-inner"
          >
            <ul className="flex flex-col space-y-3 p-4 font-medium text-gray-700">
              <li className="hover:text-indigo-600 cursor-pointer">Home</li>
              <li className="hover:text-indigo-600 cursor-pointer">Products</li>
              <li className="hover:text-indigo-600 cursor-pointer">About</li>
              <li className="hover:text-indigo-600 cursor-pointer">Contact</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
