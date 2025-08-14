import { useState } from "react";

type Toast = {
  id: number;
  message: string;
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    console.log("Toast:", message); // optional: logs in console
  };

  return { toasts, addToast };
};
