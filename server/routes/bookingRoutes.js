import express from "express";
import Booking from "../models/booking.js";
import TicketModel from "../models/ticket.js";

const router = express.Router();

// Create booking + REDUCE STOCK
router.post("/", async (req, res) => {
  try {
    const { user, ticket, adults, children, groupQty,date } = req.body;

    // VALIDATION
    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Cannot book past dates",
      });
    }

    // 1 group = 10 pepole

    const totalPeople = (adults || 0) + (children || 0) + (groupQty || 0) * 10;

    if (
      (!adults || adults === 0) &&
      (!children || children === 0) &&
      (!groupQty || groupQty === 0)
    ) {
      return res.status(400).json({
        message: "At least one booking value is required",
      });
    }

    // FIND TICKET
    const foundTicket = await TicketModel.findById(ticket);

    if (!foundTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // CHECK STOCK
    if (foundTicket.stock < totalPeople) {
      return res.status(400).json({
        message: "Not enough stock available",
      });
    }

    // CALCULATE TOTAL PRICE
    const totalPrice =
      (adults || 0) * (foundTicket.prices?.adult || 0) +
      (children || 0) * (foundTicket.prices?.child || 0)+
      (groupQty || 0) * (foundTicket.prices?.group || 0);

    // CREATE BOOKING 
    const booking = await Booking.create({
      user,
      ticket,
      adults,
      children,
      groupQty,
      date,
      totalPrice,
      status: "confirmed",
    });

    // THEN REDUCE STOCK
    foundTicket.stock -= totalPeople;
    await foundTicket.save();

    // RESPONSE
    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all user bookings
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("ticket")
      .populate("user");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users bookings to show for the admin
router.get("/", async (req, res) => {
  const bookings = await Booking.find()
    .populate("user")
    .populate("ticket");

  res.json(bookings);
});

// CANCEL BOOKING + RESTORE STOCK
router.put("/cancel/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking already cancelled",
      });
    }

    // RESTORE STOCK
    const ticket = await TicketModel.findById(booking.ticket);

    if (ticket) {
      const totalPeople = (booking.adults || 0) + (booking.children || 0) + (booking.groupQty || 0) * 10;

      ticket.stock += totalPeople;
      await ticket.save();
    }

    // UPDATE BOOKING STATUS
    booking.status = "cancelled";
    await booking.save();

    //populate before sending
    const populatedBooking = await Booking.findById(booking._id)
      .populate("ticket")
      .populate("user");

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: populatedBooking,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE BOOKING
router.put("/:id", async (req, res) => {
  try {
    const { adults, children, groupQty, date } = req.body;

    // FIND OLD BOOKING
    const oldBooking = await Booking.findById(req.params.id);

    if (!oldBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // VALIDATE DATE
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Cannot select past date",
      });
    }

    // CALCULATE PEOPLE
    const oldPeople =
      (oldBooking.adults || 0) +
      (oldBooking.children || 0) +
      (oldBooking.groupQty || 0) * 10;

    const newPeople =
      (adults || 0) +
      (children || 0) +
      (groupQty || 0) * 10;

    if (newPeople <= 0) {
      return res.status(400).json({
        message: "At least one person required",
      });
    }

    // FIND TICKET
    const ticket = await TicketModel.findById(oldBooking.ticket);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // CALCULATE DIFFERENCE
    const difference = newPeople - oldPeople;

    // If increasing people → check stock
    if (difference > 0) {
      if (ticket.stock < difference) {
        return res.status(400).json({
          message: "Not enough stock for update",
        });
      }

      ticket.stock -= difference;
    }

    // If decreasing → return stock
    if (difference < 0) {
      ticket.stock += Math.abs(difference);
    }

    await ticket.save();

    // CALCULATE TOTAL PRICE
    const totalPrice =
      (adults || 0) * (ticket.prices?.adult || 0) +
      (children || 0) * (ticket.prices?.child || 0) +
      (groupQty || 0) * (ticket.prices?.group || 0);

    // UPDATE BOOKING
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        adults,
        children,
        groupQty,
        date,
        totalPrice,
      },
      { new: true }
    );

    res.status(200).json(updatedBooking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE BOOKING
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;