import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom"; // Using hook for navigation
import api from "../api";

const Signin = () => {
  const [invalidUserName, setInvalidUserName] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate(); // hook to navigate

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (e.target.name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggingInUser = {
      UserName: username,
      Password: password,
    };

    try {
      const res = await api.loginUser(loggingInUser);
      console.log("al rag3ly mn login", res.data.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.data.userId);
      localStorage.setItem("type", res.data.type);

      if (res.data.type) {
        navigate("/admin");
      } else {
        navigate(-1); // Equivalent to `history.goBack()` in React Router v6
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.message === "invalid username") {
          setInvalidUserName(true);
        } else if (err.response.data.message === "invalid password") {
          setInvalidPassword(true);
          setInvalidUserName(false);
        }
      }
    }
  };

  // For sign up modal
  const handleModalShow = () => {
    setShow(!show);
  };

  return (
    <>
      <Form hasValidation>
        <Form.Group className="mb-3">
          <Form.Control
            size="lg"
            type="text"
            name="username"
            value={username}
            required
            isInvalid={invalidUserName}
            placeholder="Enter Username"
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Username does not exist.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            size="lg"
            type="password"
            name="password"
            value={password}
            required
            isInvalid={invalidPassword}
            placeholder="Password"
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Incorrect Password.
          </Form.Control.Feedback>
        </Form.Group>

        <div className="flex-col">
          <style type="text/css">
            {`
              .btn-flat {
                font-weight: 600;
                background-color: #37a1e2;
                color: white;
                width: 100%;
              }
              .btn-flat:hover {
                background-color: #2452b6;
                color: white;
                width: 100%;
              }
            `}
          </style>

          <Button
            variant="flat"
            size="lg"
            onClick={handleSubmit}
          >
            Log in
          </Button>

          <div className="v2"> </div>
          <Button
            variant="success"
            size="lg"
            style={{ marginTop: "10px", fontWeight: "600" }}
            onClick={handleModalShow}
          >
            Create New Account
          </Button>
        </div>
      </Form>

      <SignUp show={show} closeModal={() => setShow(false)} />
    </>
  );
};

export default Signin;