export interface Product {
  _id: string;
  name: string;
  price: number;
  company: string;
  color: string;
  category: string;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
}

export interface ApiResponse<T = Product | Product[] | Category | Category[] | string | string[]> {
  success: boolean;
  result: T;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

