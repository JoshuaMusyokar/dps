import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  apiBaseUrl: string;
  developerMode: boolean;
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
}

const initialState: SettingsState = {
  apiBaseUrl: "https://api.payment-gateway.com/v1",
  developerMode: false,
  theme: "system",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  language: "en",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setApiBaseUrl: (state, action: PayloadAction<string>) => {
      state.apiBaseUrl = action.payload;
    },
    toggleDeveloperMode: (state) => {
      state.developerMode = !state.developerMode;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
    toggleNotification: (
      state,
      action: PayloadAction<keyof SettingsState["notifications"]>
    ) => {
      const key = action.payload;
      state.notifications[key] = !state.notifications[key];
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const {
  setApiBaseUrl,
  toggleDeveloperMode,
  setTheme,
  toggleNotification,
  setLanguage,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
