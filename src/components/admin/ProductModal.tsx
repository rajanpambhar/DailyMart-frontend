// =====================================================
// PRODUCT MODAL COMPONENT
// =====================================================

import { useEffect, useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { Product, Category } from '../../types';
import { categoriesApi } from '../../services';
import toast from 'react-hot-toast';
import { compressImage, isImageFile, formatFileSize } from '../../utils/imageCompression';

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
  const [compressing, setCompressing] = useState(false);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!isImageFile(selectedFile)) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP, etc.)');
      e.target.value = ''; // Reset input
      return;
    }

    // Check file size (warn if > 5MB)
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    setOriginalFileSize(selectedFile.size);

    if (fileSizeMB > 10) {
      toast.error('Image file is too large. Please select an image smaller than 10MB.');
      e.target.value = ''; // Reset input
      return;
    }

    // Compress image if needed
    if (fileSizeMB > 0.5) {
      setCompressing(true);
      toast.loading('Compressing image...', { id: 'compress' });
      
      try {
        const compressedFile = await compressImage(selectedFile, 1, 1920, 0.8);
        const compressedSizeMB = compressedFile.size / (1024 * 1024);
        
        setFile(compressedFile);
        toast.success(
          `Image compressed: ${formatFileSize(selectedFile.size)} → ${formatFileSize(compressedFile.size)}`,
          { id: 'compress', duration: 3000 }
        );
      } catch (error) {
        console.error('Compression failed:', error);
        toast.error('Failed to compress image. Using original.', { id: 'compress' });
        setFile(selectedFile);
      } finally {
        setCompressing(false);
      }
    } else {
      setFile(selectedFile);
      toast.success('Image selected successfully');
    }
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
            <div className="flex flex-col gap-3">
              {/* Current/Selected Image Preview */}
              {(formData.image || file) && (
                <div className="relative w-24 h-24 bg-dark-700 rounded-lg overflow-hidden border-2 border-dark-600">
                  <img 
                    src={file ? URL.createObjectURL(file) : formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                  {file && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 text-center">
                      {formatFileSize(file.size)}
                    </div>
                  )}
                </div>
              )}
              
              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                  disabled={compressing || loading}
                  className="input-field w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-dark-600 file:text-white hover:file:bg-dark-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="image-upload"
                />
                {compressing && (
                  <div className="absolute inset-0 bg-dark-800/80 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                  </div>
                )}
              </div>
              
              {/* Info Text */}
              <p className="text-xs text-gray-500">
                Accepted formats: JPEG, PNG, WebP • Max size: 10MB
                {file && originalFileSize > file.size && (
                  <span className="text-green-500"> • Compressed</span>
                )}
              </p>
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
