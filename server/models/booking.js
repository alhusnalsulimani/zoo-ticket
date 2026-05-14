import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tickets",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    adults: {
      type: Number,
      required: true,
      default: 1,
    },
    children: {
      type: Number,
      default: 0,
    },
    groupQty: {
    type: Number,
    default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("bookings", bookingSchema);