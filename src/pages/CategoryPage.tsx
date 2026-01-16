// =====================================================
// CATEGORY PAGE
// Migrated from: PHP vegetables.php, fruits.php, etc.
// =====================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { productsApi } from '../services';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';

const categoryNames: Record<string, string> = {
  'vegetables': 'Vegetables',
  'fruits': 'Fruits',
  'home-essentials': 'Home Essentials',
  'mens-clothing': "Men's Clothing",
  'womens-clothing': "Women's Clothing",
  'electronics': 'Electronics',
  'kids': 'Kids',
  'beauty-products': 'Beauty Products',
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = slug ? categoryNames[slug] || slug : 'Products';

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const data = await productsApi.getByCategory(slug);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  return (
    <div className="container py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-white">{categoryName}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{categoryName}</h1>
          <p className="text-gray-400">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>
        <Link
          to="/"
          className="btn-ghost"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No products found in this category.</p>
          <Link to="/" className="btn-primary">
            Browse All Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="image-zoom rounded-xl h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
