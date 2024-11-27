import { create } from "zustand";
import { ProductColumn } from "../components/columns";

type OpenProductsState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useOpenProducts = create<OpenProductsState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
