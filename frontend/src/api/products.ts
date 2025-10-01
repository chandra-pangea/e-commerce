export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Phone XL',
    price: 799,
    description: 'A large phone with one of the best screens',
  },
  {
    id: 2,
    name: 'Phone Mini',
    price: 699,
    description: 'A great phone with one of the best cameras',
  },
  {
    id: 3,
    name: 'Phone Standard',
    price: 299,
    description: '',
  },
];

// Dummy Products API for frontend only
export const getProducts = async (params: any) => {
  return {
    products: [
      {
        id: 1,
        name: 'Product 1',
        price: 100,
        category: 'A',
        stock: 10,
        rating: 4.5,
        images: ['/logo192.png'],
        description: 'Desc 1',
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        category: 'B',
        stock: 0,
        rating: 3.8,
        images: ['/logo192.png'],
        description: 'Desc 2',
      },
    ],
    total: 2,
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
