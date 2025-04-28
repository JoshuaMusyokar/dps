import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FlashMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface FlashState {
  messages: FlashMessage[];
}

const initialState: FlashState = {
  messages: [],
};

const flashSlice = createSlice({
  name: "flash",
  initialState,
  reducers: {
    addFlash: (state, action: PayloadAction<Omit<FlashMessage, "id">>) => {
      const id = Math.random().toString(36).substring(2, 9);
      state.messages.push({ id, ...action.payload });
    },
    removeFlash: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },
    clearFlashes: (state) => {
      state.messages = [];
    },
  },
});

export const { addFlash, removeFlash, clearFlashes } = flashSlice.actions;
export const flashReducer = flashSlice.reducer;
