import React, { useState } from "react";
import { Button, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Forms.css";
import axios from 'axios';
import animalGif from '../assets/animal.gif';
import { useDispatch, useSelector } from 'react-redux';
import {login} from "../features/authSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/UserValidation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {error} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(loginSchema),
});
  const handleLogin = async()=>{
  const result = await dispatch(login({email,password}))
  if(login.fulfilled.match(result)){
    const role = result.payload.user.role;
    const userId = result.payload.user._id;
    if (role === "admin") {
      navigate("/listAdmin");
    } else {
      navigate("/listCust");
    }
  }
  }


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

      <Form onSubmit={handleSubmit(handleLogin)}>
        <h2 className="h2-topic">lOGIN TO THE ZOO</h2>

        <FormGroup className="form-group">
          <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          onChange={(e) => setEmail(e.target.value)}
        />

        <p className="text-danger">
          {errors.email?.message}
        </p>
        </FormGroup>

        <FormGroup className="form-group">
          <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register("password")}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="text-danger">
          {errors.password?.message}
        </p>
        </FormGroup>

        <Button className="btn-col" type="submit">LOGIN</Button>
        {error && <p className="text-danger">{error}</p>}
      </Form>
    </div>
  </div>
  )
}

export default Login