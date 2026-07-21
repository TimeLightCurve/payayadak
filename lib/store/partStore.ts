import { create } from 'zustand';
import { Part, Price } from '../api/services';
import { catalogService, pricingService } from '../api/services';

interface PartState {
  parts: Part[];
  selectedPart: Part | null;
  prices: Record<string, Price[]>;
  loading: boolean;
  error: string | null;

  fetchParts: (params?: {
    category?: string;
    brand?: string;
    model?: string;
    search?: string;
  }) => Promise<void>;
  fetchPart: (id: string) => Promise<void>;
  fetchPrices: (partId: string) => Promise<void>;
  setSelectedPart: (part: Part | null) => void;
  clearError: () => void;
}

export const usePartStore = create<PartState>((set) => ({
  parts: [],
  selectedPart: null,
  prices: {},
  loading: false,
  error: null,

  fetchParts: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getParts(params);
      set({ parts: data.parts || data, loading: false });
    } catch (error: unknown) {
      set({ error: extractError(error, 'خطا در دریافت قطعات'), loading: false });
    }
  },

  fetchPart: async (id) => {
    set({ loading: true, error: null });
    try {
      const part = await catalogService.getPart(id);
      set({ selectedPart: part, loading: false });
    } catch (error: unknown) {
      set({ error: extractError(error, 'خطا در دریافت قطعه'), loading: false });
    }
  },

  fetchPrices: async (partId) => {
    try {
      const prices = await pricingService.getPrices(partId);
      set((state) => ({
        prices: { ...state.prices, [partId]: prices.prices || prices },
      }));
    } catch (error: unknown) {
      set({ error: extractError(error, 'خطا در دریافت قیمت') });
    }
  },

  setSelectedPart: (part) => set({ selectedPart: part }),
  clearError: () => set({ error: null }),
}));

function extractError(error: unknown, fallback: string): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
      'string'
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message;
  }
  return fallback;
}
