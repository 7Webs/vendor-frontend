import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './slice/categorySlice';
import dealsSlice from "./slice/dealsSlice";

const store = configureStore({
  reducer: {
    category: categoryReducer,
    
    deals: dealsSlice,
  },
});

export default store;
