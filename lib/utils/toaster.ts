import toast from "react-hot-toast";
import { createElement } from "react";
import { Info } from "lucide-react";

/** Toast content only; color/background/icon-theme are set once globally on
 *  <Toaster toastOptions> in app/layout.tsx so every toast follows the
 *  current theme (light/dark) instead of a hardcoded color. */
export const toaster = {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    info: (msg: string) => toast(msg, {
      icon: createElement(Info, { className: "h-4 w-4 text-primary-strong" }),
    }),
};

export default toaster;
