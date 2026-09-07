import { Product, Category, User, Order, Review, Coupon, AdminStats } from '../types.ts';

const TOKEN_KEY = 'utsav_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string, phone?: string) {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });
    setAuthToken(res.token);
    return res;
  },

  async login(email: string, password: string) {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setAuthToken(res.token);
    return res;
  },

  async getMe() {
    return request<{ user: User }>('/api/auth/me');
  },

  async updateProfile(name: string, phone?: string) {
    return request<{ user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, phone })
    });
  },

  async addAddress(addressData: any) {
    return request<{ user: User; address: any }>('/api/auth/address', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
  },

  async deleteAddress(addressId: string) {
    return request<{ user: User }>(`/api/auth/address/${addressId}`, {
      method: 'DELETE'
    });
  },

  async forgotPassword(email: string) {
    return request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(email: string, newPassword: string) {
    return request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    });
  },

  // Categories & Products
  async getCategories() {
    return request<{ categories: Category[] }>('/api/categories');
  },

  async getProducts(params?: Record<string, any>) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const qs = query.toString();
    return request<{ products: Product[]; total: number }>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  async getProduct(idOrSlug: string) {
    return request<{ product: Product; reviews: Review[]; related: Product[] }>(`/api/products/${idOrSlug}`);
  },

  // Reviews
  async submitReview(data: { productId: string; rating: number; title: string; comment: string; userName: string }) {
    return request<{ review: Review }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number) {
    return request<{ valid: boolean; coupon?: Coupon; message: string; discountAmount: number }>('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    });
  },

  // Orders
  async createOrder(orderData: any) {
    return request<{ order: Order }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getOrders() {
    return request<{ orders: Order[] }>('/api/orders');
  },

  async getOrder(id: string) {
    return request<{ order: Order }>(`/api/orders/${id}`);
  },

  // Contact & Newsletter
  async submitContact(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return request<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async subscribeNewsletter(email: string) {
    return request<{ success: boolean; message: string }>('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // Admin
  async getAdminStats() {
    return request<{ stats: AdminStats }>('/api/admin/stats');
  },

  async getAdminProducts() {
    return request<{ products: Product[] }>('/api/admin/products');
  },

  async createAdminProduct(productData: any) {
    return request<{ product: Product }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateAdminProduct(id: string, updates: any) {
    return request<{ product: Product }>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteAdminProduct(id: string) {
    return request<{ success: boolean; message: string }>(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
  },

  async getAdminOrders() {
    return request<{ orders: Order[] }>('/api/admin/orders');
  },

  async updateOrderStatus(id: string, orderStatus: string) {
    return request<{ order: Order }>(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatus })
    });
  },

  async getAdminCustomers() {
    return request<{ customers: User[] }>('/api/admin/customers');
  }
};
