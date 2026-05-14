import express from "express";
import TicketModel from "../models/ticket.js";

const router = express.Router();

// GET all tickets
router.get("/getAllTickets", async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET single ticket by ID
router.get("/getTicket/:id", async (req, res) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST create new ticket
router.post("/createTicket", async (req, res) => {
  try {
    const { name, prices, stock, description, picture_link } = req.body;

    console.log("Incoming Data:", req.body);

    // validation
    if (!name || !prices) {
      return res.status(400).json({
        message: "Missing name or prices",
      });
    }

    if (!prices.adult && !prices.child && !prices.group) {
      return res.status(400).json({
        message: "At least one price required",
      });
    }

    // generate auto id
    const lastTicket = await TicketModel.findOne().sort({id:-1});

    let newId = 1;
    if(lastTicket){
      newId = lastTicket.id +1;
    }

    //CREATE OBJECT
    const newTicket = new TicketModel({
      id: newId,
      name,
      prices,
      stock: Number(stock) || 0,
      description,
      picture_link,
    });

    //SAVE
    const savedTicket = await newTicket.save();

    res.status(201).json(savedTicket);

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update ticket
router.put("/updateTicket/:id", async (req, res) => {
  try {
    const { name, stock, prices } = req.body;

    const updated = await TicketModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        stock,
        prices
      },
      { new: true, runValidators: true } 
    );

    if (!updated) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE ticket
router.delete("/deleteTicket/:id", async (req, res) => {
  try {
    const deletedTicket = await TicketModel.findByIdAndDelete(req.params.id);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket deleted successfully",
      ticket: deletedTicket,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// PATCH stock update
router.patch("/updateStock/:id", async (req, res) => {
  try {
    const { stock } = req.body;

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(updatedTicket);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;