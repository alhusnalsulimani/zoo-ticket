import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// create booking
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings`,
        bookingData
      );
      return res.data;
    } catch (error) {
      console.error("Backend Error Details:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);

// fetch booking for user only 
export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/user/${userId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// fetch all booking
export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// cancel Booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/cancel/${bookingId}`
      );
      return res.data.booking;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Server error");
    }
  }
);

// update booking
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// delete booking
export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/${id}`
      );
      return id; // return deleted id
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // get the booking for user
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // get all booking for the admin
      .addCase(fetchAllBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const updated = action.payload;

        const index = state.bookings.findIndex(
          (b) => b._id === updated._id
        );
        if (index !== -1) {
          state.bookings[index] = updated;
        }
      })

      // UPDATE
      .addCase(updateBooking.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.bookings.findIndex(
          (b) => b._id === updated._id
        );
        if (index !== -1) {
          state.bookings[index] = updated;
        }
      })

      // DELETE
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(
          (b) => b._id !== action.payload
        );
      });
  },
});

export default bookingSlice.reducer;