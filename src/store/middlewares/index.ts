import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as {
      status?: string | number;
      error?: string;
    };

    console.log("RTK Error:", payload);

    if (payload.status === 500) {
      console.warn("Network/API connection failed.");
      // Optional: trigger a toast, logout, etc.
    }

    if (payload.status === 403) {
      console.warn("403 Forbidden error.");
    }
  }

  return next(action);
};
