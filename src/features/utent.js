import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 1,
  name: "",
  email: "",
  isSignedIn: false,
  favorite: [],
  watchlist: [],
  watch: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    favorite: (state, action) => {
      state.favorite = action.payload;
    },
    watchlist: (state, action) => {
      state.watchlist = action.payload;
    },
    watch: (state, action) => {
      state.watch = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setSigned: (state, action) => {
      state.isSignedIn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { favorite, watchlist, watch, setName, setEmail, setSigned } =
  counterSlice.actions;

export default counterSlice.reducer;
