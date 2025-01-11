import React, { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../style/profile.css";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../api";
import MyHeader from "../components/MyHeader";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [editName, setEditName] = useState(false);
  const [editPassport, setEditPassport] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [passport, setPassport] = useState("");
  const [showChangePass, setShowChangePass] = useState(false);
  const [invalidNewPass, setInvalidNewPass] = useState(false);
  const [invalidOldPass, setInvalidOldPass] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passUpdated, setPassUpdated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    const userId = localStorage.getItem("userId");
    console.log("user id is ", userId);
    api.getUserInfo(userId).then((user) => {
      setFname(user.data.data.FirstName);
      setLname(user.data.data.LastName);
      setEmail(user.data.data.Email);
      setPassport(user.data.data.PassportNumber);
    });
  }, [navigate]);

  const handleSave = async (att) => {
    const userId = localStorage.getItem("userId");
    const newUser = {
      FirstName: fname,
      LastName: lname,
      Email: email,
      PassportNumber: passport,
    };
    await api.updateUserInfo(userId, newUser);
    if (att === "editName") setEditName(false);
    if (att === "editPassport") setEditPassport(false);
    if (att === "editEmail") setEditEmail(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPass") setOldPass(value);
    if (name === "newPass") {
      setNewPass(value);
      setInvalidNewPass(value.length < 5);
    }
  };

  const handleSubmitPass = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    const passwords = {
      oldPassword: oldPass,
      newPassword: newPass,
    };
    try {
      await api.updatePassword(userId, passwords);
      if (!invalidNewPass) {
        setPassUpdated(true);
        setShowChangePass(false);
      }
    } catch (err) {
      if (err.response && err.response.data.message === "incorrect") {
        setInvalidOldPass(true);
      }
    }
  };

  return (
    <>
      <div className="flex-col-profile">
        <MyHeader />
        <div className="flex-row-profile" style={{ marginTop: "25px" }}>
          <div className="profile-container">
            <div className="profile">
              <div className="account-icon">
                <AccountCircleIcon style={{ color: "#12228F", fontSize: "10rem" }} />
              </div>
              {!editName ? (
                <div className="name">
                  {fname} {lname}
                  <EditIcon className="icon" onClick={() => setEditName(!editName)} />
                </div>
              ) : (
                <div className="name">
                  <Form.Control
                    style={{ width: "60%" }}
                    size="sm"
                    name="fname"
                    type="text"
                    placeholder="First name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                  />
                  <Form.Control
                    style={{ width: "60%" }}
                    size="sm"
                    name="lname"
                    type="text"
                    placeholder="Last name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                  />
                  <p
                    onClick={() => handleSave("editName")}
                    style={{
                      margin: "0",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                    className="icon"
                  >
                    Save
                  </p>
                </div>
              )}
              <table>
                <tr style={{ borderBottom: "2px solid black", borderTop: "2px solid black" }}>
                  <th className="profile-th">Passport Number:</th>
                  {!editPassport ? (
                    <>
                      <td className="profile-th">{passport}</td>
                      <td className="profile-th">
                        <EditIcon className="icon" onClick={() => setEditPassport(!editPassport)} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="profile-th">
                        <Form.Control
                          style={{ width: "60%" }}
                          size="sm"
                          name="passport"
                          type="text"
                          placeholder="Passport Number"
                          value={passport}
                          onChange={(e) => setPassport(e.target.value)}
                        />
                      </td>
                      <td className="profile-th">
                        <p
                          onClick={() => handleSave("editPassport")}
                          style={{
                            margin: "0",
                            fontWeight: "bold",
                            fontSize: "medium",
                          }}
                          className="icon"
                        >
                          Save
                        </p>
                      </td>
                    </>
                  )}
                </tr>
                <tr>
                  <th className="profile-th">Email:</th>
                  {!editEmail ? (
                    <>
                      <td className="profile-th">{email}</td>
                      <td className="profile-th">
                        <EditIcon className="icon" onClick={() => setEditEmail(!editEmail)} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="profile-th">
                        <Form.Control
                          style={{ width: "60%" }}
                          size="sm"
                          name="email"
                          type="text"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </td>
                      <td className="profile-th">
                        <p
                          onClick={() => handleSave("editEmail")}
                          style={{
                            margin: "0",
                            fontWeight: "bold",
                            fontSize: "medium",
                          }}
                          className="icon"
                        >
                          Save
                        </p>
                      </td>
                    </>
                  )}
                </tr>
              </table>

              <Button
                variant="contained"
                style={{ marginTop: "20px", width: "100%" }}
                onClick={() => setShowChangePass(!showChangePass)}
              >
                Change password
              </Button>

              {passUpdated && (
                <p className="flex-row" style={{ marginTop: "10px", color: "#198754", marginBottom: "0px" }}>
                  Password successfully reset!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="my-modal"
        centered
        show={showChangePass}
      >
        <Modal.Header>
          <Modal.Title style={{ fontWeight: "600" }}>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0", height: "auto" }}>
          <Form onSubmit={handleSubmitPass}>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Old Password"
                required
                name="oldPass"
                value={oldPass}
                isInvalid={invalidOldPass}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Password doesn't match old password.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="New Password"
                required
                name="newPass"
                value={newPass}
                isInvalid={invalidNewPass}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 5 characters.
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="contained" size="md" style={{ marginTop: "10px", fontWeight: "600", width: "50%" }} type="submit">
              Change Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Profile;
