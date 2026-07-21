import apiClient from './client';

// ---- Domain types (Isuzu spare-parts catalog) ----
export interface Part {
  id: string;
  name_fa: string;
  name_en: string;
  category: string;
  brand: string;
  part_number: string;
  oem_number?: string;
  compatible_models?: string[];
  description?: string;
  image_url?: string;
  stock: number;
  lead_time_days?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Price {
  id: string;
  part_id: string;
  currency: string;
  amount: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
}

export interface RFQ {
  id: string;
  user_id: string;
  delivery_address: string;
  delivery_date?: string;
  payment_method?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  quote_id?: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'ready'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// ---- Services ----
export const catalogService = {
  getParts: async (params?: {
    category?: string;
    brand?: string;
    model?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/api/v1/catalog/parts', { params });
    return response.data;
  },
  getPart: async (id: string) => {
    const response = await apiClient.get(`/api/v1/catalog/parts/${id}`);
    return response.data;
  },
  searchParts: async (query: string) => {
    const response = await apiClient.get('/api/v1/catalog/parts/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export const pricingService = {
  getPrices: async (partId?: string) => {
    const response = await apiClient.get('/api/v1/pricing/prices', {
      params: partId ? { part_id: partId } : {},
    });
    return response.data;
  },
};

export const rfqService = {
  getRFQs: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/api/v1/orders/rfqs', { params });
    return response.data;
  },
  createRFQ: async (data: {
    delivery_address: string;
    delivery_date?: string;
    payment_method?: string;
    items: Array<{ part_id: string; quantity: number; notes?: string }>;
  }) => {
    const response = await apiClient.post('/api/v1/orders/rfqs', data);
    return response.data;
  },
};

export const orderService = {
  getOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/api/v1/orders', { params });
    return response.data;
  },
  getOrder: async (id: string) => {
    const response = await apiClient.get(`/api/v1/orders/${id}`);
    return response.data;
  },
  createOrder: async (quoteId: string) => {
    const response = await apiClient.post('/api/v1/orders', { quote_id: quoteId });
    return response.data;
  },
};

export const authService = {
  loginWithPhone: async (phone: string, code: string) => {
    const response = await apiClient.post('/api/v1/auth/phone', { phone, code });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};
