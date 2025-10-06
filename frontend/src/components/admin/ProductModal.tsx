import React from 'react';
import {
  ALLOWED_FILE_TYPES,
  ImageValidationError,
  MAX_FILE_SIZE,
  MAX_FILES,
  Product,
  ProductFormData,
} from './ProductsList';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  editingProduct: Product | null;
  imagePreviews: string[];
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  uploadErrors: ImageValidationError[];
  isUploading: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingProduct,
  imagePreviews,
  setImagePreviews,
  uploadErrors,
  isUploading,
  handleImageChange,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[32rem] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
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

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) || 0 })}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              required
              min="0"
            />
          </div>

          {/* Description */}
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

          {/* Product Images */}
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
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-md border"
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
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    onChange={handleImageChange}
                    multiple
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>

            {uploadErrors.length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                {uploadErrors.map((err, i) => (
                  <div key={i}>{err.error}</div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
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
};

export default ProductModal;
