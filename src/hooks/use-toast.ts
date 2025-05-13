
// We need to fix this file to solve the import issue
// Let's implement the toast hooks correctly

import { toast as sonnerToast, Toast } from "sonner";

type ToastProps = React.ComponentProps<typeof Toast>;

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export function toast(options: ToastOptions) {
  const { title, description, variant, action } = options;

  return sonnerToast(title, {
    description,
    action,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : "",
  });
}

export function useToast() {
  return {
    toast,
  };
}
