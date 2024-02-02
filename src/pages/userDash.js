import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
const siteUrl = process.env.REACT_APP_SITE_URL;

function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [songList, setSongList] = useState({});
  const [showPassChange, setShowPassChange] = useState(false);
  const togglePassChange = () => {
    setShowPassChange(!showPassChange);
  };
  const [updateForm, setUpdateForm] = useState(false);
  const toggleUpdateForm = () => {
    setUpdateForm(!updateForm);
  };
  const [showDelete, setShowDelete] = useState(false);
  const toggleDeleteForm = () => {
    setShowDelete(!showDelete);
  };

  const passValues = {
    oldPass: "",
    newPass: "",
  };

  const infoValues = {
    displayName: "",
    email: "",
    password: "",
  };

  const deleteValue = {
    password: "",
  };
  const deleteValid = Yup.object().shape({
    password: Yup.string().required(),
  });

  const passValiation = Yup.object().shape({
    oldPass: Yup.string(),
    newPass: Yup.string()
      .min(6)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
        "password needs uppercase, lowercase, and a number"
      ),
  });
  const infoValidation = Yup.object().shape({
    displayName: Yup.string().max(45).required("Please enter display name"),
    email: Yup.string().email("invaild email").required("Please enter email"),
    password: Yup.string().required("Please Enter your password."),
  });

  const updateUser = (data) => {
    axios
      .put("http://localhost:3001/users/dashboard/update", data, {
        headers: { jwtToken: localStorage.getItem("jwtToken") },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setUpdateForm(false);
          navigate("/dashboard");
        }
      });
  };

  const changePass = (data) => {
    axios
      .put("http://localhost:3001/users/dashboard/changePassword", data, {
        headers: { jwtToken: localStorage.getItem("jwtToken") },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setShowPassChange(false);
          navigate("/dashboard");
        }
      });
  };

  const deleteUser = (data) => {
    axios
      .delete("http://localhost:3001/users/dashboard/delete", {
        data,
        headers: { jwtToken: localStorage.getItem("jwtToken") },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("displayName");
          localStorage.removeItem("email");
          navigate("/");
        }
      });
  };

  const deleteSong = async (songId) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        await axios.delete(`${siteUrl}/songs/byId/${songId}`, {
          headers: { jwtToken: localStorage.getItem("jwtToken") },
        });
      } catch (error) {
        console.error('Error deleting song:', error);
      }
    }
  };

  useEffect(() => {
    try {
      //GET user info
      axios
        .get("http://localhost:3001/users/dashboard", {
          headers: { jwtToken: localStorage.getItem("jwtToken") },
        })
        .then((response) => {
          if (response.data.error) {
            console.log(response.data.error);
          } else {
            setUserInfo(response.data);
          }
        });
    } catch (error) {
      console.log(error);
    }
    try {
      //GET song by userId
      axios
        .get("http://localhost:3001/songs/dashboard", {
          headers: { jwtToken: localStorage.getItem("jwtToken") },
        })
        .then((response) => {
          if (response.data.error) {
            console.log(response.data.error);
          } else {
            setSongList(response.data);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="outer">
      <h1>Welcome to your dashboard</h1>
      <div className="card">
        <h2>Your Info</h2>
        {[userInfo].map((value, key) => {
          return (
            <div>
              {updateForm ? (
                <div>
                  <Formik
                    initialValues={infoValues}
                    onSubmit={updateUser}
                    validationSchema={infoValidation}
                  >
                    <Form>
                      <div className="inner">
                        <label>Display Name:</label>
                        <ErrorMessage name="displayName" component="span" />
                        <Field
                          name="displayName"
                          placeholder={value.displayName}
                        />
                      </div>
                      <div className="inner">
                        <label>Email:</label>
                        <ErrorMessage name="email" component="span" />
                        <Field name="email" placeholder={value.email} />
                      </div>
                      <div className="inner">
                        <label>Enter password:</label>
                        <ErrorMessage name="password" component="span" />
                        <Field name="password" type="password" />
                      </div>
                      <div className="inner">
                        <button type="submit">Update</button>
                      </div>
                      <div className="inner">
                        <button onClick={toggleUpdateForm}>Cancel</button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              ) : (
                <div>
                  <label>Username:</label>
                  <p>{value.username}</p>
                  <label>Displayname: </label>
                  <p>{value.displayName}</p>
                  <label>Email:</label>
                  <p>{value.email}</p>
                  <button onClick={toggleUpdateForm}>Update</button>
                  {showPassChange ? (
                    <div>
                      <Formik
                        initialValues={passValues}
                        onSubmit={changePass}
                        validationSchema={passValiation}
                      >
                        <Form>
                          <div className="inner">
                            <label>Old password:</label>
                            <ErrorMessage name="oldPass" component="span" />
                            <Field name="oldPass" type="password" />
                          </div>
                          <div className="inner">
                            <label>New password:</label>
                            <ErrorMessage name="newPass" component="span" />
                            <Field name="newPass" type="password" />
                          </div>
                          <div className="inner">
                            <button type="submit">Change Password</button>
                          </div>
                          <div className="inner">
                            <button onClick={togglePassChange}>Cancel</button>
                          </div>
                        </Form>
                      </Formik>
                    </div>
                  ) : (
                    <button onClick={togglePassChange}>Change Password</button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {showDelete ? (
          <div className="delete">
            <Formik
              initialValues={deleteValue}
              onSubmit={deleteUser}
              validationSchema={deleteValid}
            >
              <Form>
                <div className="inner">
                  <label>Enter Password:</label>
                  <ErrorMessage name="password" component="span" />
                  <Field name="password" type="password" />
                </div>
                <div className="inner">
                  <button type="submit">Delete Account</button>
                </div>
                <div className="inner">
                  <button onClick={toggleDeleteForm}>Cancel</button>
                </div>
              </Form>
            </Formik>
          </div>
        ) : (
          <div className="delete">
            <button onClick={toggleDeleteForm}>Delete Account</button>
          </div>
        )}
      </div>
      <div className="card">
        <h2>Your Songs</h2>
        {songList.length > 0 &&
          songList.map((value) => {
            return (
              <div>
                <label>Title:</label>
                <p>{value.songTitle}</p>
                <label>Song Data</label>
                {/* button to change? */}
                <label>Artwork</label>
                {/* display image and button to change? */}
                <br />
                <label>Artist: </label>
                <p>{value.artistName}</p>
                <label>Album:</label>
                <p>{value.albumTitle}</p>
                <label>Tags:</label>
                <p>{value.tags}</p>
                <label>Year:</label>
                <p>{value.year}</p>
                <label>Description:</label>
                <p>{value.description}</p>
                <button>Update Song Info</button>
                <button type="button" onClick={() => deleteSong(value.songId)}>Delete Song</button>
                {/* link to song info update page? */}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;
