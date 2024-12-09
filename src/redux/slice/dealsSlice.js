
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../api/apiwrapper";

export const fetchDeals = createAsyncThunk(
    "deals/fetchDeals",
    async (id = null,query = null) => {
        const response = await apiService.get(
            id ? `deals/${id}` : `deals/my-deals?${query}`
        );
        return response.data;
    }
);

const dealsSlice = createSlice({
    name: "deals",
    initialState: {
        list: [],
        selectedDeal: null,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeals.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.status = "succeeded";
                if (Array.isArray(action.payload)) {
                    state.list = action.payload;
                } else {
                    state.selectedDeal = action.payload;
                }
            })
            .addCase(fetchDeals.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default dealsSlice.reducer;
