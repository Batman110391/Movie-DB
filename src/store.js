import { configureStore } from "@reduxjs/toolkit";
import utentReducer from "./features/utent";

export const store = configureStore({
  reducer: {
    utent: utentReducer,
  },
});
