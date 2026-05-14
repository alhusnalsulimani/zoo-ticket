import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Route,Routes } from "react-router-dom";
import { Container, Row, Col } from "reactstrap"; 
import Register from "./pages/Register"
import Login from "./pages/Login"
import './App.css';
import TicketListCust from "./components/customer/TicketListCust";
import TicketListAdmin from "./components/admin/TicketListAdmin";
import ProtectedRoute from './ProtectedRoute';
import MyTickets from "./components/customer/MyTickets";
import BookTicket from "./components/customer/BookTicket";
import EditBooking from "./components/customer/EditBooking";
import EditTicket from "./components/admin/EditTicket";
import AdminManageBookings from "./components/admin/AdminManageBookings";
import AddTicket from "./components/admin/AddTicket";
import Profile from "./components/customer/Profile";

function App() {
  return (
    <div className="app">
      <Header /> {/* Move outside Container so it's truly edge-to-edge */}
      
      <Container fluid> {/* 'fluid' makes it span 100% width */}
        <Row>
          <Col className="main-content">
          <div className="content-wrapper">
            <Routes>
                {/* For all users */}
                <Route path='/' element={<Home />}/>
                <Route path='/register' element={<Register />}/>
                <Route path='/login' element={<Login />}/>

                {/* Pages for admin */}
                <Route path='/listAdmin' 
                element={
                  <ProtectedRoute allowedRoles='admin'>
                   <TicketListAdmin /> 
                  </ProtectedRoute>
                }/>
                <Route path="/admin/edit-ticket/:id" 
                element={
                  <ProtectedRoute allowedRoles='admin'>
                   <EditTicket /> 
                  </ProtectedRoute>
                }/>

                <Route path="/admin/bookings" 
                element={
                  <ProtectedRoute allowedRoles='admin'>
                   <AdminManageBookings /> 
                  </ProtectedRoute>
                }/>

                <Route
                  path="/addTicket"
                  element={
                    <ProtectedRoute allowedRoles="admin">
                      <AddTicket />
                    </ProtectedRoute>
                  }
                />

                {/* Pages for customer */}
                <Route path='/listCust' 
                element={
                  <ProtectedRoute allowedRoles='customer'>
                    <TicketListCust />
                  </ProtectedRoute>
                }/>

                <Route path="/book/:id" 
                element={
                  <ProtectedRoute allowedRoles="customer">
                    <BookTicket />
                  </ProtectedRoute>
                } />

                <Route path='/tickets' 
                element={
                  <ProtectedRoute allowedRoles='customer'>
                    <MyTickets />
                  </ProtectedRoute>
                }/>
                <Route path="/edit-booking/:id" element={
                  <ProtectedRoute allowedRoles='customer'>
                    <EditBooking />
                  </ProtectedRoute>
                  }/>
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles='customer'>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
              
          </div>
              
          </Col>
        </Row>
      </Container>

      <Footer /> {/* Move outside Container */}
    </div>
  );
}


export default App
