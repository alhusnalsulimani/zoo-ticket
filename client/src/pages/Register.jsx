import React, { useState } from "react";
import { Button, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Forms.css";
import animalGif from '../assets/animal.gif';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validations/UserValidation";

function Register() {
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(registerSchema),
});

  const registerCustomer = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/user/register", {
        userName,
        email,
        phoneno,
        password,
        role: "customer",
      });

      setMsg(res.data.message);
      setIsRegistered(true);
    } catch (error) {
      setMsg(error.response?.data?.message || "Something went wrong");
      setIsRegistered(false);
    }
  };

  return (
  <div className="content-wrapper">
    <div className="auth-card">
      {/* Animated Animal Section */}
      <div className="animal-path">
    {/* Replace with your local pixel art image path */}
    <img
      src={animalGif}
      className="pixel-animal"
      alt="Walking Animal"
    />
  </div>

      <Form onSubmit={handleSubmit(registerCustomer)}>
        <h2 className="h2-topic">Zoo Registeration</h2>

        <FormGroup className="form-group">
          <label>Visitor Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          {...register("userName")}
          onChange={(e) => setName(e.target.value)}
        />

        <p className="text-danger">
          {errors.userName?.message}
        </p>
        </FormGroup>

        <FormGroup className="form-group">
          <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          {...register("email")}
          onChange={(e) => setEmail(e.target.value)}
        />

        <p className="text-danger">
          {errors.email?.message}
        </p>
        </FormGroup>

        <FormGroup className="form-group">
          <label> Phone</label>
        <input
          type="text"
          placeholder="Enter phone number"
          {...register("phoneno")}
          onChange={(e) => setPhoneno(e.target.value)}
        />

        <p className="text-danger">
          {errors.phoneno?.message}
        </p>
        </FormGroup>

        <FormGroup className="form-group">
          <label>Password</label>
        <input
          type="password"
          placeholder="Create a strong password"
          {...register("password")}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="text-danger">
          {errors.password?.message}
        </p>
        </FormGroup>

        <Button className="btn-col" type="submit">
          Start My Adventure
        </Button>

        {/* Message */}
        {msg && (
          <div className={`mt-3 text-center ${isRegistered ? "text-success" : "text-danger"}`}>
            {msg}
          </div>
        )}


        <div className="form-links">
          <small>
            Already a member? <Link to="/login">Sign In Here</Link>
          </small>
        </div>
      </Form>
    </div>
  </div>
);

}

export default Register;