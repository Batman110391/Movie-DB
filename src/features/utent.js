import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  userImage: "",
  isSignedIn: false,
  favorite: [],
  watchlist: [],
  watch: [],
  myList: {},
  historySearch: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    historySearch: (state, action) => {
      state.historySearch = action.payload;
    },
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
    setImgUser: (state, action) => {
      state.userImage = action.payload;
    },
    setUser: (state, action) => {
      const newState = { ...state, ...action.payload };

      return newState;
    },
    logout: (state, action) => {
      return initialState;
    },
    setList: (state, action) => {
      state.myList = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  favorite,
  watchlist,
  watch,
  setName,
  setEmail,
  setSigned,
  setUser,
  setImgUser,
  logout,
  setList,
  historySearch,
} = counterSlice.actions;

export default counterSlice.reducer;
