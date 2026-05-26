export interface Product {
  _id: string;
  name: string;
  price: number;
  company: string;
  color: string;
  category: string;
}

export interface ApiResponse {
  success: boolean;
  result: Product[] | Product | string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

