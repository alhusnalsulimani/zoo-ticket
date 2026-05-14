// Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
//import "./Profile.css";

const Profile = () => {
  const [ip, setIp] = useState(null);
  const [country, setCountry] = useState(null);
  const [region, setRegion] = useState(null);

  const getGeoLocationData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_LOCATION_API_KEY}`);
      setIp(response.data.ip);
      setCountry(response.data.location.country);
      setRegion(response.data.location.region);
    } catch (error) {
      console.error("Error fetching geolocation data:", error.message);
    }
  };

  useEffect(() => { getGeoLocationData(); }, []);

  const fields = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      label: "IP Address",
      value: ip,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          <line x1="4" y1="22" x2="4" y2="15"/>
        </svg>
      ),
      label: "Country",
      value: country,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: "Region",
      value: region,
    },
  ];

  return (
    <div className="profile-wrapper">
      <div className="passport-card">

        <div className="passport-header">
          <div className="passport-stamp">
            <span>ZOO<br />PASS</span>
          </div>
          <p className="passport-subtitle">Visitor passport</p>
          <h2 className="passport-title">My Profile</h2>
        </div>

        <div className="passport-body">
          {fields.map(({ icon, label, value }, index) => (
            <div key={label} className={`passport-row ${index < fields.length - 1 ? "passport-row--bordered" : ""}`}>
              <div className="passport-icon">{icon}</div>
              <div>
                <p className="passport-label">{label}</p>
                <p className="passport-value">{value ?? "Loading…"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="passport-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>ZooBooking · Verified visitor</span>
        </div>

      </div>
    </div>
  );
};

export default Profile;