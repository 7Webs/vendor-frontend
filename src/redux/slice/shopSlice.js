import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/apiwrapper';

// Async thunk for getting shop details
export const getShop = createAsyncThunk(
    'shop/getShop',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.get('/shop');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for registering a shop
export const registerShop = createAsyncThunk(
    'shop/registerShop',
    async (shopData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', shopData.name);
            formData.append('email', shopData.email);
            formData.append('description', shopData.description);
            formData.append('address', shopData.address);
            // formData.append('approved', false);
            formData.append('categoryId', shopData.categoryId);
            // formData.append('id', '');
            formData.append('logo', shopData.logo);
            formData.append('backgroundArt', shopData.backgroundArt);

            const response = await apiService.post('/shop', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Shop
            .addCase(getShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getShop.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register Shop
            .addCase(registerShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerShop.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(registerShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default shopSlice.reducer;
