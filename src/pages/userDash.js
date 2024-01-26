import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

function Dashboard() {
  const [userInfo, setUserInfo] = useState([]);
  const [songList, setSongList] = useState([]);
  //GET userId from db with ??? auth from JWT ???
  //authorize and get user info
  useEffect(() => {
    try {
      axios
        .get("http://localhost:3001/users/????GET????")
        //pass header? for userId?
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
      axios
        .get("http://localhost:3001/songs/??GET??")
        //pass header? for userId?
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
  //GET all user songs

  return (
    <div className="outer">
      <h1>Welcome to your dashboard</h1>
      <p>I swear I will make this look ok, some how.</p>
      <div className="card">
        <h2>Your Info</h2>
        {userInfo.map((value, key) => {
          return (
            <div>
              <label>Username:</label>
              <p>{value.username}</p>
              <label>Displayname: </label>
              <p>{value.displayName}</p>
              <label>Email:</label>
              <p>{value.email}</p>
            </div>
          );
        })}
      </div>
      <div className="card">
        <h2>Your Songs</h2>
        {songList.map((value, key) => {
          return (
            <div>
              <label>Title:</label>
              <p>{value.songTitle}</p>
              <label>Song Data</label>
              {/* button to change? */}
              <label>Artowrk</label>
              {/* display image and button to change? */}
              <label>Artist: </label>
              <p>{value.artistName}</p>
              <label>Album:</label>
              <p>{value.albumName}</p>
              <label>Tags:</label>
              <p>{value.tags}</p>
              <label>Year:</label>
              <p>{value.year}</p>
              <label>Description:</label>
              <p>{value.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
