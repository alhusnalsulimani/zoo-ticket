import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets } from "../../features/ticketSlice";

function TicketListCust() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tickets, isLoading } = useSelector((state) => state.ticket);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <Container>
      <h2 className="text-center">Choose Your Ticket</h2>

      <Row>
        {tickets.map((ticket) => (
          <Col md={4} key={ticket._id} className="py-3 d-flex">
            <Card className="text-center shadow-sm w-100">
              <img
                src={ticket.picture_link}
                alt={ticket.name}
                className="card-img-top"
                style={{ height: "100%", width:"100%", objectFit: "cover" }}
              />

              <CardBody className="d-flex flex-column">
                <CardTitle tag="h4" className="mb-2" style={{minHeight:"3rem"}}>
                  {ticket.name}
                </CardTitle>

                <p className="text-muted small mb-2">{ticket.description}</p>

                <div className="mb-2">
                  {ticket.prices?.adult && (
                    <p className="mb-1">Adult: {ticket.prices.adult} OMR</p>
                  )}

                  {ticket.prices?.child && (
                    <p className="mb-1">Child: {ticket.prices.child} OMR</p>
                  )}

                  {ticket.prices?.group && (
                    <p className="mb-1">Group: {ticket.prices.group} OMR</p>
                  )}
                </div>

                <p className="small mb-3">Stock: {ticket.stock}</p>

                <button
                  className="btn btn-success w-100"
                  onClick={() => navigate(`/book/${ticket._id}`)}
                  disabled={ticket.stock === 0}
                >
                  {ticket.stock > 0 ? "Book Now" : "Out of Stock"}
                </button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TicketListCust;
