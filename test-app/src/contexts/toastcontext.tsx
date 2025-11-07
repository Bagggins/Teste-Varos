// contexts/ToastContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          className: "border-green-700 bg-green-900/50",
          icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
          title: "Sucesso",
        };
      case "error":
        return {
          className: "border-red-700 bg-red-900/50",
          icon: <AlertCircle className="h-5 w-5 text-red-400" />,
          title: "Erro",
        };
      case "warning":
        return {
          className: "border-yellow-700 bg-yellow-900/50",
          icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
          title: "Aviso",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container - Bottom Center */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex flex-col items-center gap-3 pointer-events-none">
        <div className="w-full max-w-md px-4 flex flex-col gap-3 pointer-events-auto">
          {toasts.map((toast) => {
            const config = getToastConfig(toast.type);
            return (
              <Alert
                key={toast.id}
                className={`${config.className} relative animate-in slide-in-from-bottom-5 shadow-lg`}
              >
                {config.icon}
                <div className="flex-1">
                  <AlertTitle className="text-gray-100 font-semibold">
                    {config.title}
                  </AlertTitle>
                  <AlertDescription className="text-gray-200">
                    {toast.message}
                  </AlertDescription>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Alert>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
