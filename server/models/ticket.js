import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: {type: String, required: true},
  prices: {
    adult: { type: Number },
    child: { type: Number },
    group: { type: Number }
  },
  stock: {type: Number,required: true,default: 0},
  description: {type: String, default: ""},
  picture_link: {type: String,default: ""}
}, {
  timestamps: true
});

const TicketModel = mongoose.model("tickets", ticketSchema);

export default TicketModel;