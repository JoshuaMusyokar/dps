import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth-slice";
import { api } from "./apis/public-api";
import { flashReducer } from "./slices/flash-slice";
import { rtkQueryErrorLogger } from "./middlewares";
import { registrationReducer } from "./slices/business-registration";
import { settingsReducer } from "./slices/settings-slice";
import { rbacReducer } from "./slices/rbac-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rbac: rbacReducer,
    registration: registrationReducer,
    flash: flashReducer,
    settings: settingsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(rtkQueryErrorLogger),
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
