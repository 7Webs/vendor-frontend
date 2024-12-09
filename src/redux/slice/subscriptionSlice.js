import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../api/apiwrapper";

export const getSubscriptions = createAsyncThunk(
  "subscription/getSubscriptions",
  async () => {
    const response = await apiService.get("subscriptions");
    return response.data;
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    list: [],
    selectedSubscription: null,
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubscriptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (Array.isArray(action.payload)) {
          state.list = action.payload;
        } else {
          state.selectedSubscription = action.payload;
        }
      })
      .addCase(getSubscriptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default subscriptionSlice.reducer;
