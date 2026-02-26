// =====================================================
// ADMIN PRODUCTS PAGE
// Migrated from: PHP admin_products.php
// =====================================================

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Search, Star } from 'lucide-react';
import { productsApi } from '../../services';
import { Product } from '../../types';
import toast from 'react-hot-toast';
import ProductModal from '../../components/admin/ProductModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getProducts({
        search: search || undefined,
        page: currentPage,
        limit: 10,
      });
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productsApi.deleteProduct(productToDelete);
      toast.success('Product deleted successfully');
      fetchProducts();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleToggleBestSelling = async (id: string) => {
    try {
      await productsApi.toggleBestSelling(id);
      toast.success('Best selling status updated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update best selling status');
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: FormData | Partial<Product>) => {
    try {
      if (selectedProduct) {
        // Edit mode
        await productsApi.updateProduct(selectedProduct.id, data);
        toast.success('Product updated successfully');
      } else {
        // Create mode
        await productsApi.createProduct(data);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      
      // Handle specific error cases
      if (error?.response?.status === 413) {
        toast.error('Image file is too large. Please select a smaller image.');
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(selectedProduct ? 'Failed to update product' : 'Failed to create product');
      }
      throw error; 
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in p-6">
      <div className="flex-none">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <button 
          onClick={handleAddProduct}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
      </div>
      </div>

      </div>

      {/* Products Table */}
      <div className="flex-1 min-h-0 glass-card flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full relative">
              <thead className="sticky top-0 z-10 bg-dark-600 shadow-md">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-dark-600/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-dark-600 rounded-lg overflow-hidden flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <Plus className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {product.category?.name || product.categorySlug}
                      </td>
                      <td className="px-6 py-4 text-primary-500 font-medium">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={product.stockQuantity > 0 ? 'text-green-400' : 'text-red-400'}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${product.isActive ? 'badge-success' : 'badge-error'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleBestSelling(product.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.isBestSelling
                                ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                                : 'text-gray-400 hover:text-yellow-400 hover:bg-dark-600'
                            }`}
                            title="Toggle Best Selling"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex-none flex items-center justify-center gap-2 p-4 border-t border-dark-600 bg-dark-700/50 backdrop-blur-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-primary-500 text-dark-900'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedProduct}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete Product"
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminProducts;
