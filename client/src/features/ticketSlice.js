import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// create ticket
export const createTicket = createAsyncThunk(
  "ticket/createTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/tickets/createTicket`,
        ticketData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);

// get or fetch the ticket
export const fetchTickets = createAsyncThunk(
  "ticket/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/tickets/getAllTickets`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// fetch only one ticket
export const fetchTicketById = createAsyncThunk(
  "ticket/fetchTicketById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/tickets/getTicket/${id}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// delete ticket
export const deleteTicket = createAsyncThunk(
  "ticket/deleteTicket",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/tickets/deleteTicket/${id}`
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// update or edit the ticket
export const updateTicket = createAsyncThunk(
  "ticket/updateTicket",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/tickets/updateTicket/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);


const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    tickets: [],
    selectedTicket: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create Ticket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // get all booking for the admin
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // get ticket by id
      .addCase(fetchTicketById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- updateTicket
      .addCase(updateTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.isLoading = false;

        // update selected ticket
        state.selectedTicket = action.payload;

        // update in list
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload._id
        );

        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      
      .addCase(updateTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- deleteTicket ---
      .addCase(deleteTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = state.tickets.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
      
  },
});

export default ticketSlice.reducer;