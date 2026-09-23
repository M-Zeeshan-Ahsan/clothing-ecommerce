import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

export const showToast = (
  content: ReactNode,
  type: ToastType = "info",
  onClose?: () => void,
  options?: ToastOptions,
) => {
  toast[type](content, {
    position: "top-right",
    autoClose: type === "error" ? 2000 : 1000,
    theme: "colored",
    onClose,
    ...options,
  });
};
