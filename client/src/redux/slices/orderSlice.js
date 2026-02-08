import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useEffect, useState } from "react";

// Async Thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (_, { rejectWithValue }) => {
    try {
        if (!token) {
            return rejectWithValue("User not logged in");
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Async Thunk to fetch order details by id
export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails", async (orderId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                },
            }
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// create a slice to manage all the state related to orders
const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null,
        isLoggedIn: !!localStorage.getItem("userToken"), // 🔒 check login at start
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                // state.orders = action.payload;
                if (action.payload === "User not logged in") {
                    state.isLoggedIn = false; // ✅ handle not logged in
                    state.error = null; // don't show this as an "error"
                    state.orders = [];
                } else {
                    state.error = action.payload || "Failed to fetch orders";
                }
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetch order details
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
    }
});

export default orderSlice.reducer;