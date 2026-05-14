import React from "react";
import "./Header.css";
import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="logo">ZooBooking</div>

      <Navbar>
        {/* CUSTOMER */}
        {role === "customer" && (
          <Nav>
            <NavItem>
              <NavLink tag={Link} to="/listCust">
                Ticket List
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/tickets">
                My Tickets
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/profile">
                Profile
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink onClick={handleLogout}>
                Logout
              </NavLink>
            </NavItem>
          </Nav>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <Nav>
            <NavItem>
              <NavLink tag={Link} to="/listAdmin">
                Ticket List
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/addTicket">
                Add Ticket
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/admin/bookings">
                Manage Booking
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink onClick={handleLogout}>
                Logout
              </NavLink>
            </NavItem>
          </Nav>
        )}

        {/* GUEST  */}
        {!role && (
          <Nav>
            <NavItem>
              <NavLink tag={Link} to="/login">
                Login
              </NavLink>
            </NavItem>

          </Nav>
        )}
      </Navbar>
    </div>
  );
}

export default Header;