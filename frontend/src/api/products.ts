export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images?: string[];
  stock?: number;
}

export interface ProductsParams {
  page?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 999,
    description: 'The latest iPhone with amazing camera capabilities',
    category: 'Phones',
    images: ['/logo192.png'],
    stock: 10,
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    price: 2499,
    description: 'Powerful laptop for professionals',
    category: 'Laptops',
    images: ['/logo192.png'],
    stock: 5,
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 249,
    description: 'Premium wireless earbuds with noise cancellation',
    category: 'Accessories',
    images: ['/logo192.png'],
    stock: 15,
  },
  {
    id: 4,
    name: 'iPad Air',
    price: 599,
    description: 'Versatile tablet for work and play',
    category: 'Tablets',
    images: ['/logo192.png'],
    stock: 8,
  },
  {
    id: 5,
    name: 'Apple Watch Series 8',
    price: 399,
    description: 'Advanced health and fitness tracking',
    category: 'Wearables',
    images: ['/logo192.png'],
    stock: 12,
  },
  {
    id: 6,
    name: 'Samsung Galaxy S23',
    price: 899,
    description: 'Premium Android smartphone',
    category: 'Phones',
    images: ['/logo192.png'],
    stock: 7,
  },
];

// Dummy Products API for frontend only
export const getProducts = async (params: ProductsParams) => {
  const { page = 1, category, minPrice, maxPrice } = params;
  const itemsPerPage = 9;

  // Filter products based on criteria
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  if (typeof minPrice === 'number') {
    filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
  }

  if (typeof maxPrice === 'number') {
    filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
  }

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return {
    products: paginatedProducts,
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / itemsPerPage),
  };
};

export const getProductDetails = async (id: number) => {
  return {
    id,
    name: `Product ${id}`,
    price: 100 * id,
    category: 'A',
    stock: 10,
    rating: 4.5,
    images: ['/logo192.png'],
    description: 'Desc',
    related: [2],
  };
};
export {};
