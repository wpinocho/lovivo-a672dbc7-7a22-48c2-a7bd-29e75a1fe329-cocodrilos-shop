import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Crocodile } from '@/types/crocodile';
import { toast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Crocodile }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  console.log('Cart action:', action.type, action.payload);
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.crocodile.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.crocodile.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.crocodile.price * item.quantity), 0);
        const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          items: updatedItems,
          total: newTotal,
          itemCount: newItemCount
        };
      } else {
        const newItems = [...state.items, { crocodile: action.payload, quantity: 1 }];
        const newTotal = newItems.reduce((sum, item) => sum + (item.crocodile.price * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          items: newItems,
          total: newTotal,
          itemCount: newItemCount
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.crocodile.id !== action.payload);
      const newTotal = newItems.reduce((sum, item) => sum + (item.crocodile.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      
      const newItems = state.items.map(item =>
        item.crocodile.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const newTotal = newItems.reduce((sum, item) => sum + (item.crocodile.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const useCartActions = () => {
  const { dispatch } = useCart();

  const addToCart = (crocodile: Crocodile) => {
    console.log('Adding to cart:', crocodile.name);
    dispatch({ type: 'ADD_ITEM', payload: crocodile });
    toast({
      title: "¡Agregado al carrito!",
      description: `${crocodile.name} ha sido agregado a tu carrito.`,
    });
  };

  const removeFromCart = (id: string) => {
    console.log('Removing from cart:', id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast({
      title: "Eliminado del carrito",
      description: "El artículo ha sido eliminado de tu carrito.",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('Updating quantity:', id, quantity);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    console.log('Clearing cart');
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Carrito vaciado",
      description: "Todos los artículos han sido eliminados del carrito.",
    });
  };

  return { addToCart, removeFromCart, updateQuantity, clearCart };
};