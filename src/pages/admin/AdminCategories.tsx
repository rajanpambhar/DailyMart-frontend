// =====================================================
// ADMIN CATEGORIES PAGE
// =====================================================

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { categoriesApi } from '../../services';
import { Category } from '../../types';
import toast from 'react-hot-toast';
import CategoryModal from '../../components/admin/CategoryModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getAll(true);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleActive = async (id: string) => {
    try {
      await categoriesApi.toggleActive(id);
      toast.success('Category status updated');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category status');
    }
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoriesApi.delete(categoryToDelete);
      toast.success('Category deleted successfully');
      fetchCategories();
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: Partial<Category>) => {
    try {
      if (selectedCategory) {
        // Edit mode
        await categoriesApi.update(selectedCategory.id, data);
        toast.success('Category updated successfully');
      } else {
        // Create mode
        await categoriesApi.create(data);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(selectedCategory ? 'Failed to update category' : 'Failed to create category');
      throw error;
    }
  };

  return (
    <div className="h-full overflow-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <button 
          onClick={handleAddCategory}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Products</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-dark-600/50">
                      <td className="px-6 py-4 font-mono text-sm text-primary-500">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-gray-400 truncate max-w-xs">
                        {category.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {category._count?.products || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${category.isActive ? 'badge-success' : 'badge-error'}`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(category.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              category.isActive
                                ? 'text-green-400 hover:bg-green-400/10'
                                : 'text-gray-400 hover:bg-dark-600'
                            }`}
                            title="Toggle Active"
                          >
                            {category.isActive ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category.id)}
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
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedCategory}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete Category"
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminCategories;
