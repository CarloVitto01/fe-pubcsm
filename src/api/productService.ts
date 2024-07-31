import axios from './axios';
import { Product } from '../types';

export const getProducts = () => axios.get<Product[]>('/products');
export const getProductById = (id: number) => axios.get<Product>(`/products/${id}`);
export const createProduct = (product: Product) => axios.post<Product>('/products', product);
export const updateProduct = (id: number, product: Product) => axios.put<Product>(`/products/${id}`, product);
export const deleteProduct = (id: number) => axios.delete<void>(`/products/${id}`);
