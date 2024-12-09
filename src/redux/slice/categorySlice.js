import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../api/apiwrapper";

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (id = null) => {
    const response = await apiService.get(
      id ? `category/${id}` : `category`
    );
    return response.data;
  }
);

const cataloguesSlice = createSlice({
  name: "catalogues",
  initialState: {
    list: [],
    selectedCategory: null,
    status: "idle", 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (Array.isArray(action.payload)) {
          state.list = action.payload;
        } else {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cataloguesSlice.reducer;
