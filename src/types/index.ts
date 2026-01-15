// =====================================================
// TYPESCRIPT TYPE DEFINITIONS
// Migrated from PHP database structures
// =====================================================

// User Types
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Category Types
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  _count?: {
    products: number;
  };
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  slashedPrice?: number;
  categorySlug: string;
  image?: string;
  stockQuantity: number;
  isActive: boolean;
  isBestSelling: boolean;
  createdAt?: string;
  category?: {
    name: string;
    slug: string;
  };
}

export interface ProductQueryParams {
  category?: string;
  isActive?: boolean;
  isBestSelling?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: Pagination;
}

// Cart Types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stockQuantity: number;
}

// Order Types
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'UPI' | 'COD';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type DeliveryStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: {
    name: string;
    image?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
  deliveryStatus: DeliveryStatus;
  createdAt?: string;
  user?: {
    id: string;
    fullname: string;
    email: string;
  };
  orderItems: OrderItem[];
}

export interface CreateOrderData {
  items: { productId: string; quantity: number }[];
  paymentMethod: PaymentMethod;
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
}

export interface OrderQueryParams {
  status?: PaymentStatus;
  deliveryStatus?: DeliveryStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: Pagination;
}

// Common Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Dashboard Statistics
export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalUsers: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
}

export interface UserStats {
  total: number;
  admins: number;
  users: number;
  recentUsers: number;
}
