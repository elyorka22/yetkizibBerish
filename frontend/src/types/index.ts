// User Roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',
  PICKER = 'picker',
  COURIER = 'courier',
}

// Order Status
export enum OrderStatus {
  NEW = 'new',
  ASSIGNED_TO_PICKER = 'assigned_to_picker',
  PICKED = 'picked',
  ASSIGNED_TO_COURIER = 'assigned_to_courier',
  IN_DELIVERY = 'in_delivery',
  DELIVERED = 'delivered',
}

// User
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Product
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Category
export interface Category {
  id: string;
  title: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Item
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Order
export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  managerId?: string;
  pickerId?: string;
  courierId?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

// Statistics
export interface Statistics {
  totalOrders: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  ordersByStatus: Record<OrderStatus, number>;
  courierEfficiency: Record<string, number>;
  pickerEfficiency: Record<string, number>;
}

// Banner
export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

