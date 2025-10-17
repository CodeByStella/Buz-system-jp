import React from "react";
import * as ReactDOM from "react-dom";

interface ToastProps {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
  durationMs?: number; // auto-dismiss duration
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  durationMs = 4000,
}) => {
  const colors = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  React.useEffect(() => {
    if (!onClose) return;
    const id = setTimeout(() => onClose?.(), durationMs);
    return () => clearTimeout(id);
  }, [onClose, durationMs]);

  if (typeof document === "undefined") {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 pointer-events-none z-[2000]">
      <div
        className={`absolute top-4 right-4 min-w-[320px] max-w-md border-l-4 p-4 rounded shadow-lg pointer-events-auto ${colors[type]} animate-slide-in`}
        role="alert"
      >
        <div className="flex items-start">
          <span className="text-xl mr-3 flex-shrink-0">{icons[type]}</span>
          <p className="flex-1 text-sm font-medium">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-3 flex-shrink-0 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
