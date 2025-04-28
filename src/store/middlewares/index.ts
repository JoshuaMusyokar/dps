import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as {
      status?: string | number;
      error?: string;
    };

    console.error("RTK Error:", payload);

    if (payload.status === "FETCH_ERROR") {
      console.warn("Network/API connection failed.");
      // Optional: trigger a toast, logout, etc.
    }

    if (payload.status === 403) {
      console.warn("403 Forbidden error.");
    }
  }

  return next(action);
};
