import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../features/ticketSlice";
import { ticketSchema } from "../../validations/TicketValidation";

function AddTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adultPrice, setAdultPrice] = useState("");
  const [childPrice, setChildPrice] = useState("");
  const [groupPrice, setGroupPrice] = useState("");
  const [stock, setStock] = useState("");
  const [picture, setPicture] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      description,
      adult: adultPrice,
      child: childPrice,
      group: groupPrice,
      stock,
      picture_link: picture,
    };

    try {
      // clear old errors
      setErrors({});

      // VALIDATION
      await ticketSchema.validate(formData, { abortEarly: false });

      const ticketData = {
        name,
        description,
        stock: Number(stock),
        picture_link: picture,
        prices: {
          adult: adultPrice ? Number(adultPrice) : undefined,
          child: childPrice ? Number(childPrice) : undefined,
          group: groupPrice ? Number(groupPrice) : undefined,
        },
      };

      const result = await dispatch(createTicket(ticketData));

      if (createTicket.fulfilled.match(result)) {
        alert("Ticket added successfully");
        navigate("/listAdmin");
      } else {
        alert(result.payload || "Error adding ticket");
      }

    } catch (err) {
      const newErrors = {};

      if (err.inner) {
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
      } else {
        newErrors.general = err.message;
      }

      setErrors(newErrors);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Ticket</h2>

      <form onSubmit={handleSubmit}>
        
        {/* NAME */}
        <input
          type="text"
          className="form-control mb-1"
          placeholder="Ticket Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-danger">{errors.name}</p>

        {/* DESCRIPTION */}
        <textarea
          className="form-control mb-1"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-danger">{errors.description}</p>

        {/* PRICES */}
        <input
          type="number"
          className="form-control mb-1"
          placeholder="Adult Price"
          value={adultPrice}
          onChange={(e) => setAdultPrice(e.target.value)}
        />
        <p className="text-danger">{errors.adult}</p>

        <input
          type="number"
          className="form-control mb-1"
          placeholder="Child Price"
          value={childPrice}
          onChange={(e) => setChildPrice(e.target.value)}
        />
        <p className="text-danger">{errors.child}</p>

        <input
          type="number"
          className="form-control mb-1"
          placeholder="Group Price"
          value={groupPrice}
          onChange={(e) => setGroupPrice(e.target.value)}
        />
        <p className="text-danger">{errors.group}</p>

        {/* STOCK */}
        <input
          type="number"
          className="form-control mb-1"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <p className="text-danger">{errors.stock}</p>

        {/* IMAGE */}
        <input
          type="text"
          className="form-control mb-1"
          placeholder="Image URL"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
        />
        <p className="text-danger">{errors.picture_link}</p>

        {/* GENERAL ERROR */}
        <p className="text-danger">{errors.general}</p>

        <button className="btn btn-success w-100">
          Add Ticket
        </button>
      </form>
    </div>
  );
}

export default AddTicket;