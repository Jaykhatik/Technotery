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
  result: Product[] | string;
}
