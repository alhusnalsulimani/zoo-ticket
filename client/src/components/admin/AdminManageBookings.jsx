import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookings, deleteBooking } from "../../features/bookingSlice";

function AdminManageBookings() {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.booking);

  const isPastDate = (date) =>
    new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this cancelled booking?")) {
      dispatch(deleteBooking(id));
    }
  };

  const totalBookings     = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalGuests = bookings.reduce(
    (sum, b) => sum + (b.adults || 0) + (b.children || 0) + (b.groupQty || 0) * 10,
    0
  );

  if (isLoading) {
    return <div className="loading-state">Loading bookings…</div>;
  }

  return (
    <div className="admin-bookings-wrapper">
      <h2>Admin Booking Management</h2>

      {/* ── STAT CARDS ── */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">
            {totalRevenue}{" "}
            <span style={{ fontSize: "1rem", fontWeight: 500 }}>OMR</span>
          </div>
        </div>

        <div className="stat-card confirmed">
          <div className="stat-label">Confirmed</div>
          <div className="stat-value">{confirmedBookings}</div>
        </div>

        <div className="stat-card cancelled">
          <div className="stat-label">Cancelled</div>
          <div className="stat-value">{cancelledBookings}</div>
        </div>

        <div className="stat-card guests">
          <div className="stat-label">Total Guests</div>
          <div className="stat-value">{totalGuests}</div>
        </div>
      </div>

      {/* ── BOOKINGS TABLE ── */}
      <div className="table-card">
        <div className="table-header-bar">
          <span>All Bookings</span>
          <span style={{ fontSize: "0.78rem", color: "#8a9070" }}>
            {totalBookings} records
          </span>
        </div>

        <div className="table-scroll">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Ticket</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

<tbody>
              {bookings.map((b) => {
                const isFinished =
                  b.ticket?.name &&
                  isPastDate(b.date) &&
                  b.status !== "cancelled";
                const isCancelled = b.status === "cancelled";
                const hasNoTicket = !b.ticket?.name;

                return (
                  <tr key={b._id}>
                    {/* Customer */}
                    <td>
                      <span className="customer-name">
                        {b.user?.userName || "N/A"}
                      </span>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className="contact-email">{b.user?.email || "—"}</div>
                      <div className="contact-phone">{b.user?.phoneno || "—"}</div>
                    </td>

                    {/* Ticket */}
                    <td>
                      {b.ticket?.name ? (
                        <span className="ticket-name">{b.ticket.name}</span>
                      ) : (
                        <span className="ticket-na">N/A</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="date-cell">
                      {b.date ? new Date(b.date).toLocaleDateString() : "—"}
                    </td>

                    {/* Guests */}
                    <td className="guests-cell">
                      {b.groupQty > 0
                        ? `G: ${b.groupQty}`
                        : `A:${b.adults || 0} / C:${b.children || 0}`}
                    </td>

                    {/* Total */}
                    <td className="total-cell">{b.totalPrice || 0} OMR</td>

                    {/* Status */}
                    <td>
                      {b.ticket?.name ? (
                        <span
                          className={`badge ${
                            isCancelled
                              ? "badge-cancelled"
                              : isFinished
                              ? "badge-finished"
                              : "badge-confirmed"
                          }`}
                        >
                          {isCancelled
                            ? "Cancelled"
                            : isFinished
                            ? "Finished"
                            : "Confirmed"}
                        </span>
                      ) : (
                        <span className="badge-na">N/A</span>
                      )}
                    </td>

                    {/* Action */}
                    <td>
                      {(isCancelled || hasNoTicket || isFinished) && (
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(b._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminManageBookings;
