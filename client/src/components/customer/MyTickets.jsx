import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "../../features/bookingSlice";
import {cancelBooking } from "../../features/bookingSlice"

function MyTickets() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { bookings, isLoading } = useSelector((state) => state.booking);
  const navigate = useNavigate();
  const isPastDate = (date) => new Date(date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchMyBookings(userId));
    }
  }, [dispatch, userId]);

  if (isLoading) return <h3>Loading...</h3>;

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelBooking(id));
    }
  };

  // Allows the booking to stay if it has a ticket name or  if it's explicitly cancelled
  const validBookings = bookings.filter((b) => (b.ticket && b.ticket.name) || b.status === "cancelled");

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Tickets</h2>

      {validBookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        validBookings.map((b) => (
          <div key={b._id} className="card mb-4 shadow-sm">
            
            {/* HEADER */}
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>{b.ticket?.name}</h5>
              <span className={`badge ${
                b.status === "cancelled" ? "bg-danger" : 
                isPastDate(b.date) ? "bg-warning" : "bg-success"
              }`}>
                {b.status === "cancelled" ? "Cancelled" : isPastDate(b.date) ? "Finished" : b.status}
              </span>
            </div>

            {/* BODY */}
            <div className="card-body">
              <div className="row">
                
                {/* CUSTOMER */}
                <div className="col-md-4">
                  <h6>Customer Details</h6>
                  <p>{b.user?.userName}</p>
                  <p>{b.user?.email}</p>
                  <p>{b.user?.phoneno}</p>
                </div>

                {/* VISIT */}
                <div className="col-md-4">
                  <h6>Visit Information</h6>
                  <p>{new Date(b.date).toDateString()}</p>
                  {b.groupQty > 0 ? (
                    <p>Group Quantity: {b.groupQty}</p>
                    ) : (
                      <>
                      <p>Adults: {b.adults}</p>
                      <p>Children: {b.children}</p>
                      </>
                  )}
                </div>

                {/* PAYMENT */}
                <div className="col-md-4">
                  <h6>Payment</h6>
                  <h4 className="text-success">
                    {b.totalPrice} OMR
                  </h4>
                  <p>
                    Booked on {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>

              </div>

              <hr />

              {/* ACTIONS */}
              
              {/* Only show Edit if not cancelled AND not finished */}
              {b.status !== "cancelled" && !isPastDate(b.date) && (
                <button className="btn btn-outline-success me-2"
                  onClick={() => navigate(`/edit-booking/${b._id}`, { state: b })}>
                    Edit Booking
                </button>
              )}

              <button
                className="btn btn-outline-danger"
                onClick={() => handleCancel(b._id)}
                // Disable if cancelled OR if the date has passed
                disabled={b.status === "cancelled" || isPastDate(b.date)}
              >
                {b.status === "cancelled" ? "Cancelled" : isPastDate(b.date) ? "Trip Finished" : "Cancel Booking"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyTickets;