import {
  toast as toastify,
  type Id,
  type ToastOptions,
} from "react-toastify";

function opts(second?: number | ToastOptions): ToastOptions | undefined {
  if (second === undefined) return undefined;
  if (typeof second === "number") return { autoClose: second };
  return second;
}

export const toast = {
  success: (message: string, second?: number | ToastOptions): Id =>
    toastify.success(message, opts(second)),
  error: (message: string, second?: number | ToastOptions): Id =>
    toastify.error(message, opts(second)),
  info: (message: string, second?: number | ToastOptions): Id =>
    toastify.info(message, opts(second)),
  loading: (message: string, second?: number | ToastOptions): Id =>
    toastify.loading(message, opts(second)),
};
