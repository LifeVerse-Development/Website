import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: number; 
    name: string;
    price: number;
    image: string;
    quantity: number;
}

const getStoredCart = (): CartItem[] => {
    if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            return JSON.parse(storedCart);
        }
    }
    return [];
};

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: getStoredCart(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find((item) => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeItem: (state, action: PayloadAction<{ id: number }>) => {
            state.items = state.items.filter((item) => item.id !== action.payload.id);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; amount: number }>) => {
            const item = state.items.find((item) => item.id === action.payload.id);
            if (item) {
                const updatedQuantity = item.quantity + action.payload.amount;
                item.quantity = updatedQuantity > 0 ? updatedQuantity : 1;
                localStorage.setItem('cart', JSON.stringify(state.items));
            }
        },
    },
});

export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
