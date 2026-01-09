import { create } from 'zustand';
import { Product, OrderItem } from '@/types';

interface CartItem extends OrderItem {
  productId: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Simple localStorage persistence
const getStoredItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('cart-storage');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredItems = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart-storage', JSON.stringify(items));
  }
};

export const useCartStore = create<CartState>()((set, get) => {
  // Инициализация из localStorage
  const initialItems = getStoredItems();
  
  return {
    items: initialItems,
    
    addItem: (product, quantity = 1) => {
      set((state) => {
        const existingItem = state.items.find(item => item.productId === product.id);
        let newItems: CartItem[];
        
        if (existingItem) {
          newItems = state.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [
            ...state.items,
            {
              productId: product.id,
              productName: product.name,
              quantity,
              price: product.price,
            },
          ];
        }
        setStoredItems(newItems);
        return { items: newItems };
      });
    },
    
    removeItem: (productId) => {
      set((state) => {
        const newItems = state.items.filter(item => item.productId !== productId);
        setStoredItems(newItems);
        return { items: newItems };
      });
    },
    
    updateQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        get().removeItem(productId);
        return;
      }
      
      set((state) => {
        const newItems = state.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        );
        setStoredItems(newItems);
        return { items: newItems };
      });
    },
    
    clearCart: () => {
      setStoredItems([]);
      set({ items: [] });
    },
    
    getTotal: () => {
      return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    
    getItemCount: () => {
      return get().items.reduce((count, item) => count + item.quantity, 0);
    },
  };
});
