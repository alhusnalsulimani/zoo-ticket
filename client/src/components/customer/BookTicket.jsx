import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createBooking } from "../../features/bookingSlice";
import { fetchTicketById } from "../../features/ticketSlice";

function BookTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedTicket: ticket, isLoading, error  } = useSelector(
    (state) => state.ticket
  );

  const [date, setDate] = useState("");

  // normal tickets
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // group tickets
  const [groupQty, setGroupQty] = useState(1);

  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);

  // FETCH TICKET
  useEffect(() => {
    dispatch(fetchTicketById(id));
  }, [dispatch, id]);

  // CHECK TYPE
  const isGroupTicket =
  ticket?.prices?.group != null &&
  ticket?.prices?.adult == null &&
  ticket?.prices?.child == null;

  // CALCULATE TOTAL
  useEffect(() => {
    if (!ticket) return;

    if (isGroupTicket) {
      const groupPrice = ticket.prices.group || 0;
      setTotal(groupQty * groupPrice);
    } else {
      const adultPrice = ticket.prices?.adult || 0;
      const childPrice = ticket.prices?.child || 0;

      setTotal(adults * adultPrice + children * childPrice);
    }
  }, [adults, children, groupQty, ticket, isGroupTicket]);

  if (isLoading) return <h3>Loading...</h3>;
  if (!ticket) return <h3>No ticket found</h3>;

  // CONFIRM BOOKING
  const handleConfirm = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const bookingData = {
      user: userId,
      ticket: ticket._id,
      date,


      adults: isGroupTicket ? 0 : Number(adults),
      children: isGroupTicket ? 0 : Number(children),
      groupQty: isGroupTicket ? Number(groupQty) : 0,
    };

    const result = await dispatch(createBooking(bookingData));

    if (createBooking.fulfilled.match(result)) {
      alert("Booking successful!");
      navigate("/tickets");
    } else {
      alert(result.payload || "Error booking");
    }
  };

  return (
    <div className="container mt-4">
      {error && <p className="text-danger">{error}</p>}
      <h2>{ticket.name}</h2>
      <p>{ticket.description}</p>

      {/* DATE */}
      <div className="mb-3">
        <label>Select Date</label>
        <input
          type="date"
          className="form-control"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* NORMAL TICKET */}
      {!isGroupTicket && (
        <>
          <div className="mb-3">
            <label>Adults</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            />
          </div>

          <div className="mb-3">
            <label>Children</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            />
          </div>
        </>
      )}

      {/* GROUP TICKET */}
      {isGroupTicket && (
        <div className="mb-3">
          <label>Number of Groups</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={groupQty}
            onChange={(e) => setGroupQty(Number(e.target.value))}
          />
        </div>
      )}

      {/* TOTAL */}
      <h4>Total: {total.toFixed(2)} OMR</h4>

      {/* BUTTONS */}
      <button className="btn btn-success me-2" onClick={handleConfirm}>
        Confirm Booking
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>
    </div>
  );
}

export default BookTicket;