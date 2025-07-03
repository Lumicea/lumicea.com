import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  attributes: {
    material?: string;
    gemstone?: string;
    size?: string;
    gauge?: string;
  };
}

interface CartStore {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  
  // Actions
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  
  // Derived state
  calculateSubtotal: () => number;
  calculateItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      itemCount: 0,
      
      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) => 
            i.productId === item.productId && 
            i.variantId === item.variantId &&
            JSON.stringify(i.attributes) === JSON.stringify(item.attributes)
        );
        
        let newItems;
        
        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          newItems = [...items];
          newItems[existingItemIndex].quantity += item.quantity;
        } else {
          // Add new item
          newItems = [...items, { ...item, id: `${item.variantId}-${Date.now()}` }];
        }
        
        set({ 
          items: newItems,
          subtotal: get().calculateSubtotal(),
          itemCount: get().calculateItemCount(),
        });
      },
      
      updateItemQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) => 
            item.id === id ? { ...item, quantity } : item
          ),
          subtotal: get().calculateSubtotal(),
          itemCount: get().calculateItemCount(),
        }));
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          subtotal: get().calculateSubtotal(),
          itemCount: get().calculateItemCount(),
        }));
      },
      
      clearCart: () => {
        set({ items: [], subtotal: 0, itemCount: 0 });
      },
      
      calculateSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      calculateItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'lumicea-cart',
      skipHydration: typeof window === 'undefined',
    }
  )
);