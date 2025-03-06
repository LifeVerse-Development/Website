import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getStoredCart = (): Array<{ id: string; quantity: number }> => {
    if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            return JSON.parse(storedCart);
        }
    }
    return [];
};

interface CartState {
    items: Array<{ id: string, quantity: number }>;
}

const initialState: CartState = {
    items: getStoredCart(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeItem: (state, action: PayloadAction<{ id: string }>) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
