import React from 'react'
import "./Home.css";
import videoBg from "../assets/flamingo-cinematic.mp4";
import { Link } from 'react-router-dom';
function Home() {
  return (
    <div className='home'>
      {/* this to display the video */}
      <video autoPlay loop muted className="video-bg">
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="content">
        <h1>Welcome to Zoo Ticket Booking</h1>
        <p>Book your adventure with wildlife today</p>
        <Link to="/register" >Rejester Now To Book Your Ticket!</Link>
      </div>
      
    </div>
  )
}

export default Home