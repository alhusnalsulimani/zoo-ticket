import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import bookingReducer from "../features/bookingSlice";
import ticketReducer from "../features/ticketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    ticket: ticketReducer,
  },
});