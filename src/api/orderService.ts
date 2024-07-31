import axios from './axios';
import { Order } from '../types';

export const getOrders = () => axios.get<Order[]>('/orders');
export const getOrderById = (id: number) => axios.get<Order>(`/orders/${id}`);
export const createOrder = (order: Order) => axios.post<Order>('/orders', order);
export const updateOrder = (id: number, order: Order) => axios.put<Order>(`/orders/${id}`, order);
export const deleteOrder = (id: number) => axios.delete<void>(`/orders/${id}`);
