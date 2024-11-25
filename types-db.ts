export interface Products {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  isFeatured: boolean;
  isArchived: boolean;
  categoryId: string;
  sizeId: string;
  category: Category;
  size: Size;
  product: Products;
  kitchen: string;
  cuisine: string;
  qty: number;

}

export interface Category {
  id: string;
  billboardId: string;
  billboardLabel: string;
  name: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Kitchen {
  id: string;
  name: string;
  value: string;
}

export interface Cuisines {
  id: string;
  name: string;
  value: string;
}

export interface Orders {
  id: string;
  isPaid: boolean;
  phone: string;
  orderItems: Products[];
  address: string;
  order_status: string;
  userId: string;
}

export interface Origin {
  id: string;
  name: string;
  value: string;
}