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
      console.log(state);
    },
    watchlist: (state, action) => {
      state.watchlist = action.payload;
      console.log(state);
    },
    watch: (state, action) => {
      state.watch = action.payload;
      console.log(state);
    },
    setName: (state, action) => {
      state.name = action.payload;
      console.log(state);
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      console.log(state);
    },
    setSigned: (state, action) => {
      state.isSignedIn = action.payload;
      console.log(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const { favorite, watchlist, watch, setName, setEmail, setSigned } =
  counterSlice.actions;

export default counterSlice.reducer;
