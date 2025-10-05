import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/admin';

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILES = 5;

interface Product {
  id: number;
  name: string;
  price: number;
  category: string; // Changed from optional to required
  stock: number; // Changed from optional to required
  images?: string[];
  description: string; // Changed from optional to required
}

interface ProductFormData {
  name: string;
  price: number;
  category: string;
  stock: number;
  images: File[];
  description: string;
}

// Image validation error type
interface ImageValidationError {
  file: File;
  error: string;
}

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    images: [],
    description: '',
  });
  const [uploadErrors, setUploadErrors] = useState<ImageValidationError[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      const response = await getAllProducts();
      // Add type assertion to ensure all required fields are present
      const productsWithDefaults = response.products.map((product) => ({
        ...product,
        category: product.category || '',
        stock: product.stock || 0,
        description: product.description || '',
      }));
      setProducts(productsWithDefaults);
      setTotalPages(Math.ceil(response.products.length / 10));
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const hasNewImages = formData.images.length > 0;

        if (hasNewImages) {
          // If there are new images, send as FormData
          const submitData = new FormData();
          submitData.append('name', formData.name);
          submitData.append('price', formData.price.toString());
          submitData.append('category', formData.category);
          submitData.append('stock', formData.stock.toString());
          submitData.append('description', formData.description);

          // Append new images
          formData.images.forEach((image) => {
            submitData.append('images', image);
          });

          // Append existing images that weren't removed
          imagePreviews.forEach((imageUrl) => {
            if (!imageUrl.startsWith('blob:')) {
              submitData.append('existingImages', imageUrl);
            }
          });

          await updateProduct(editingProduct.id, submitData);
        } else {
          // If no new images, send as JSON
          const updateData: Partial<Product> = {
            name: formData.name,
            price: formData.price,
            category: formData.category,
            stock: formData.stock,
            description: formData.description,
            images: imagePreviews,
          };
          await updateProduct(editingProduct.id, updateData);
        }
        toast.success('Product updated successfully');
      } else {
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('price', formData.price.toString());
        submitData.append('category', formData.category);
        submitData.append('stock', formData.stock.toString());
        submitData.append('description', formData.description);

        // Append new images if any
        formData.images.forEach((image) => {
          submitData.append('images', image);
        });

        await createProduct(submitData);
        toast.success('Product created successfully');
      }

      closeModal();
      loadProducts();
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category || '',
      stock: product.stock || 0,
      images: [], // Keep existing images separate
      description: product.description || '',
    });
    setImagePreviews(product.images || []);
    setIsModalOpen(true);
    setUploadErrors([]);
    setModalKey((prev) => prev + 1);
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.map((type) => type.split('/')[1]).join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
    }
    return null;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    setIsUploading(true);
    setUploadErrors([]);
    const newFiles: File[] = Array.from(e.target.files);
    const currentFiles = [...formData.images];
    const errors: ImageValidationError[] = [];
    const validFiles: File[] = [];
    const previews: string[] = [...imagePreviews];

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        errors.push({ file, error });
      } else if (currentFiles.length + validFiles.length < MAX_FILES) {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      } else {
        errors.push({ file, error: `Maximum ${MAX_FILES} images allowed` });
      }
    }

    if (errors.length) {
      setUploadErrors(errors);
      errors.forEach(({ error }) => toast.error(error));
    }

    if (validFiles.length) {
      setFormData({ ...formData, images: [...currentFiles, ...validFiles] });
      setImagePreviews(previews);
    }

    setIsUploading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      category: '',
      stock: 0,
      images: [],
      description: '',
    });
    setImagePreviews([]);
    setUploadErrors([]);
    setModalKey((prev) => prev + 1);
  };

  const ProductModal = () => (
    <div
      key={modalKey}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg w-[32rem] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
              <span className="text-gray-500 ml-1">
                (Max {MAX_FILES} images, {MAX_FILE_SIZE / 1024 / 1024}MB each)
              </span>
            </label>
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={preview} className="relative">
                  <img
                    src={preview}
                    alt={`Product preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      const newPreviews = imagePreviews.filter((_, i) => i !== index);
                      setFormData({ ...formData, images: newImages });
                      setImagePreviews(newPreviews);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.images.length < MAX_FILES && (
                <label className="cursor-pointer flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400">
                  <span className="text-gray-600">+</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    multiple
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
            {uploadErrors.length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                {uploadErrors.map((error, index) => (
                  <div key={index}>{error.error}</div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isUploading ? 'Uploading...' : editingProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.images?.[0] || '/logo192.png'}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{product.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">10</span> of{' '}
              <span className="font-medium">{products.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === index + 1
                      ? 'z-10 bg-red-50 border-red-500 text-red-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && <ProductModal />}
    </div>
  );
};

export default ProductsList;
