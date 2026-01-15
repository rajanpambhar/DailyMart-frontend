// =====================================================
// PRODUCT MODAL COMPONENT
// =====================================================

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Product, Category } from '../../types';
import { categoriesApi } from '../../services';
import toast from 'react-hot-toast';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Product | null;
  title: string;
}

const ProductModal = ({ isOpen, onClose, onSubmit, initialData, title }: ProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Form state
  // We use strings for numeric fields to allow empty state and prevent leading zeros
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    slashedPrice: '',
    categorySlug: '',
    image: '',
    stockQuantity: '',
    isActive: true,
    isBestSelling: false,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoriesApi.getAll(true); // Include inactive categories too for admin
        setCategories(data);
        
        // If creating new and no category selected, select first one
        if (!initialData && data.length > 0 && !formData.categorySlug) {
          setFormData(prev => ({ ...prev, categorySlug: data[0].slug }));
        }
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Reset or set form data when opening/closing
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        price: initialData.price.toString(),
        slashedPrice: initialData.slashedPrice?.toString() || '',
        categorySlug: initialData.categorySlug,
        image: initialData.image || '',
        stockQuantity: initialData.stockQuantity.toString(),
        isActive: initialData.isActive,
        isBestSelling: initialData.isBestSelling,
      });
    } else if (isOpen && !initialData) {
      setFormData({
        name: '',
        description: '',
        price: '',
        slashedPrice: '',
        categorySlug: categories.length > 0 ? categories[0].slug : '',
        image: '',
        stockQuantity: '',
        isActive: true,
        isBestSelling: false,
      });
    }
  }, [isOpen, initialData, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('slashedPrice', formData.slashedPrice);
      submitData.append('categorySlug', formData.categorySlug);
      submitData.append('stockQuantity', formData.stockQuantity);
      submitData.append('isActive', String(formData.isActive));
      submitData.append('isBestSelling', String(formData.isBestSelling));

      if (file) {
        submitData.append('image', file);
      } else if (formData.image) {
        submitData.append('image', formData.image);
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-800 rounded-xl w-full max-w-md border border-dark-600 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600 sticky top-0 bg-dark-800 z-10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="Ex. Fresh Organic Apples"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category *</label>
            {loadingCategories ? (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading categories...
              </div>
            ) : (
              <select
                name="categorySlug"
                value={formData.categorySlug}
                onChange={handleChange}
                required
                className="input-field w-full"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price & Slashed Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Slashed Price (₹)</label>
              <input
                type="number"
                name="slashedPrice"
                value={formData.slashedPrice}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Stock Quantity *</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="0"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
            <div className="flex flex-col gap-2">
              {formData.image && !file && (
                <div className="relative w-20 h-20 bg-dark-700 rounded-lg overflow-hidden border border-dark-600">
                  <img 
                    src={formData.image} 
                    alt="Current" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="input-field w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-dark-600 file:text-white hover:file:bg-dark-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field w-full resize-none"
              placeholder="Product description..."
            />
          </div>

          {/* Status Switches */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={!!formData.isActive}
                onChange={(e) => handleCheckboxChange('isActive', e.target.checked)}
                className="w-5 h-5 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500/20"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-white cursor-pointer select-none">
                Active Product
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isBestSelling"
                name="isBestSelling"
                checked={!!formData.isBestSelling}
                onChange={(e) => handleCheckboxChange('isBestSelling', e.target.checked)}
                className="w-5 h-5 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500/20"
              />
              <label htmlFor="isBestSelling" className="text-sm font-medium text-white cursor-pointer select-none">
                Mark as Best Seller
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-dark-600 sticky bottom-0 bg-dark-800 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary min-w-[120px]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
