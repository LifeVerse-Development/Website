import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getStoredModalState = (): { isOpen: boolean; modalType: string | null } => {
    if (typeof window !== 'undefined') {
        const storedIsOpen = localStorage.getItem('isModalOpen');
        const storedModalType = localStorage.getItem('modalType');

        return {
            isOpen: storedIsOpen ? storedIsOpen === 'true' : false,
            modalType: storedModalType,
        };
    }
    return { isOpen: false, modalType: null };
};

interface ModalState {
    isOpen: boolean;
    modalType: string | null;
}

const initialState: ModalState = getStoredModalState();

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<string>) => {
            state.isOpen = true;
            state.modalType = action.payload;
            localStorage.setItem('isModalOpen', 'true');
            localStorage.setItem('modalType', action.payload);
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.modalType = null;
            localStorage.removeItem('isModalOpen');
            localStorage.removeItem('modalType');
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
