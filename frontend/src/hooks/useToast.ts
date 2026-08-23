import { useContext } from "react";
import {
  ToastContext,
  type ToastContextType,
} from "../context/toast-context";

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
};
