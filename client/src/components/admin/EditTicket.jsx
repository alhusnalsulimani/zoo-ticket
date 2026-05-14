import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateTicket, fetchTicketById } from "../../features/ticketSlice";
import { editTicketSchema } from "../../validations/TicketValidation";

function EditTicket() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTicket } = useSelector((state) => state.ticket);

  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [pictureLink, setPictureLink] = useState("");
  const [adultPrice, setAdultPrice] = useState("");
  const [childPrice, setChildPrice] = useState("");
  const [groupPrice, setGroupPrice] = useState("");
  const [isGroupOnly, setIsGroupOnly] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // LOAD DATA FROM REDUX TOOLKIT
  useEffect(() => {
    if (location.state) {
      fillForm(location.state);
    } else {
      dispatch(fetchTicketById(id));
    }
  }, [id]);

  // when redux data arrives → fill form
  useEffect(() => {
    if (!location.state && selectedTicket && selectedTicket._id === id) {
      fillForm(selectedTicket);
    }
  }, [selectedTicket]);

  // FILL FORM
  const fillForm = (data) => {
    setName(data.name || "");
    setStock(data.stock || 0);
    setDescription(data.description || "");
    setPictureLink(data.picture_link || "");

    const hasGroup = data?.prices?.group != null;
    const hasAdult = data?.prices?.adult != null;
    const hasChild = data?.prices?.child != null;

    if (hasGroup && !hasAdult && !hasChild) {
      setIsGroupOnly(true);
      setGroupPrice(data.prices.group);
      setAdultPrice("");
      setChildPrice("");
    } else {
      setIsGroupOnly(false);
      setAdultPrice(data?.prices?.adult ?? "");
      setChildPrice(data?.prices?.child ?? "");
      setGroupPrice("");
    }
  };

  // SUBMIT WITH VALIDATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Normalize values BEFORE validation
    const formData = {
      name,
      stock,
      description,
      picture_link: pictureLink,
      adult: isGroupOnly ? null : adultPrice === "" ? null : Number(adultPrice),
      child: isGroupOnly ? null : childPrice === "" ? null : Number(childPrice),
      group: isGroupOnly ? (groupPrice === "" ? null : Number(groupPrice)) : null,
    };

    try {
      setErrors({});

      // Use the dedicated edit schema
      await editTicketSchema.validate(formData, { abortEarly: false });

      // Build prices object
      const prices = {};
      if (formData.group !== null) {
        prices.group = formData.group;
      } else {
        if (formData.adult !== null) prices.adult = formData.adult;
        if (formData.child !== null) prices.child = formData.child;
      }

      const result = await dispatch(
        updateTicket({
          id,
          data: {
            name: formData.name,
            stock: Number(formData.stock),
            description: formData.description,
            picture_link: formData.picture_link,
            prices,
          },
        })
      );

      if (updateTicket.fulfilled.match(result)) {
        setMessage("Ticket updated successfully!");
        setTimeout(() => {
          navigate("/listAdmin");
        }, 1500);
      } else {
        setErrors({ general: result.payload || "Update failed. Please try again." });
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
    <div className="container mt-5">
      <h3>Edit Ticket</h3>

      {message && <div className="alert alert-success">{message}</div>}
      {errors.general && <div className="alert alert-danger">{errors.general}</div>}

      <form onSubmit={handleSubmit}>

        {/* NAME */}
        <label>Ticket Name</label>
        <input
          className="form-control mb-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-danger">{errors.name}</p>

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          className="form-control mb-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-danger">{errors.description}</p>

        {/* PICTURE LINK */}
        <label>Image URL</label>
        <input
          type="text"
          className="form-control mb-1"
          value={pictureLink}
          onChange={(e) => setPictureLink(e.target.value)}
        />
        <p className="text-danger">{errors.picture_link}</p>

        {/* STOCK */}
        <label>Stock</label>
        <input
          type="number"
          className="form-control mb-1"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <p className="text-danger">{errors.stock}</p>

        {/* PRICES */}
        {isGroupOnly ? (
          <>
            <label>Group Price</label>
            <input
              type="number"
              className="form-control mb-1"
              value={groupPrice}
              onChange={(e) => setGroupPrice(e.target.value)}
            />
            <p className="text-danger">{errors.group}</p>
          </>
        ) : (
          <>
            <label>Adult Price</label>
            <input
              type="number"
              className="form-control mb-1"
              value={adultPrice}
              onChange={(e) => setAdultPrice(e.target.value)}
            />
            <p className="text-danger">{errors.adult}</p>

            <label>Child Price</label>
            <input
              type="number"
              className="form-control mb-1"
              value={childPrice}
              onChange={(e) => setChildPrice(e.target.value)}
            />
            <p className="text-danger">{errors.child}</p>
          </>
        )}

        <button className="btn btn-success mt-2">Update Ticket</button>
      </form>
    </div>
  );
}

export default EditTicket;