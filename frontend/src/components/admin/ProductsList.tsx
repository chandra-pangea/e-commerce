import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/admin';
import ProductModal from './ProductModal';

// File validation constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILES = 5;

export interface Product {
  _id?: string;
  id: number;
  name: string;
  price: number;
  category: string; // Changed from optional to required
  stock: number; // Changed from optional to required
  images?: string[];
  description: string; // Changed from optional to required
}

export interface ProductFormData {
  name: string;
  price: number;
  category: string;
  stock: number;
  images: File[];
  description: string;
}

// Image validation error type
export interface ImageValidationError {
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

          await updateProduct(editingProduct._id!, submitData);
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
          await updateProduct(editingProduct._id!, updateData);
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

  const handleDelete = async (productId: string) => {
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
  };

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
                    onClick={() => handleDelete(product._id!)}
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
      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingProduct={editingProduct}
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        uploadErrors={uploadErrors}
        isUploading={isUploading}
        handleImageChange={handleImageChange}
      />
    </div>
  );
};

export default ProductsList;
