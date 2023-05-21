import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HttpStateKind } from "../global/types";

// interfaces
interface Message {
  success: string | null;
  error: string | null;
}
interface LoadingState {
  statut: "error" | "idle" | "loading" | "success";
  message: Message;
}

const initialLoadingState: LoadingState = {
  statut: "idle",
  message: {
    success: null,
    error: null,
  },
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: initialLoadingState,
  reducers: {
    setStatut(
      state,
      action: PayloadAction<"error" | "idle" | "loading" | "success">
    ) {
      state.statut = action.payload;
    },
    setMessage(state, action: PayloadAction<Message>) {
      state.message = action.payload;
    },
    resetStore(state) {
      state.statut = initialLoadingState.statut;
      state.message = initialLoadingState.message;
    },
  },
});

export const loadingActions = loadingSlice.actions;

export default loadingSlice.reducer;
