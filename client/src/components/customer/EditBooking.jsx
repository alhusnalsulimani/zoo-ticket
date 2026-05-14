import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateBooking } from "../../features/bookingSlice";
import { fetchTicketById } from "../../features/ticketSlice";

function EditBooking() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const booking = location.state;

  // Redux ticket state
  const { selectedTicket: ticket } = useSelector((state) => state.ticket);

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [groupQty, setGroupQty] = useState(0);
  const [updatedData, setUpdatedData] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load booking + ticket
  useEffect(() => {
    if (booking) {
      setDate(booking.date?.substring(0, 10));
      setAdults(booking.adults || 1);
      setChildren(booking.children || 0);
      setGroupQty(booking.groupQty || 0);

      const ticketId = booking.ticket._id || booking.ticket;
      dispatch(fetchTicketById(ticketId));
    } else {
      fetch(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDate(data.date.substring(0, 10));
          setAdults(data.adults);
          setChildren(data.children);
          setGroupQty(data.groupQty);

          dispatch(fetchTicketById(data.ticket));
        });
    }
  }, [booking, id, dispatch]);

  const isGroupTicket =
    ticket?.prices?.group != null &&
    ticket?.prices?.adult == null &&
    ticket?.prices?.child == null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const updated = await dispatch(
        updateBooking({
          id,
          data: {
            date,
            adults: isGroupTicket ? 0 : Number(adults),
            children: isGroupTicket ? 0 : Number(children),
            groupQty: isGroupTicket ? Number(groupQty) : 0,
          },
        })
      ).unwrap();

      setMessage("Booking updated successfully");
      setUpdatedData(updated);

      setTimeout(() => navigate("/tickets"), 1500);
    } catch (err) {
      setError(err || "Not enough stock available");
    }
  };

  if (!ticket) return <h3>Loading...</h3>;

  return (
    <div className="container mt-5">
      <h3>Edit Booking: {ticket.name}</h3>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Booking Date</label>
        <input
          type="date"
          className="form-control mb-3"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
        />

        {isGroupTicket ? (
          <div className="mb-3">
            <label>Number of Groups</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={groupQty}
              onChange={(e) => setGroupQty(Number(e.target.value))}
            />
          </div>
        ) : (
          <>
            <label>Adults</label>
            <input
              type="number"
              className="form-control mb-3"
              min="1"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            />

            <label>Children</label>
            <input
              type="number"
              className="form-control mb-3"
              min="0"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            />
          </>
        )}

        <button className="btn btn-success me-2">
          Update Booking
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>

      {updatedData && (
        <div className="card mt-4 p-3">
          <h5>Updated Total: {updatedData.totalPrice} OMR</h5>
        </div>
      )}
    </div>
  );
}

export default EditBooking;