import React, { useState, useEffect } from "react";
import { FiEdit2, FiEdit3 } from "react-icons/fi";
import "../Styles/profilec.css";

function Profile() {
  const [user, setUser] = useState({ username: "", email: "", profile_pic: "", bio: "" });
  const [editing, setEditing] = useState({ username: false, bio: false });
  const [newUsername, setNewUsername] = useState("");
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/auth/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setUser(data);
        setNewUsername(data.username);
        setNewBio(data.bio || "");
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profile_pic", file);
    try {
      const response = await fetch("/api/auth/upload-profile-pic", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      setUser((prev) => ({ ...prev, profile_pic: data.profile_pic }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, bio: newBio }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setUser((prev) => ({ ...prev, username: newUsername, bio: newBio }));
      setEditing({ username: false, bio: false });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear session storage
    window.location.href = "/login"; 
  };

  return (
    <div className="profile-container">
      <header>
        <div className="profile-pic-container">
          <img src={user.profile_pic || "default-profile.png"} alt="Profile" className="profile-pic" />
          <label htmlFor="profile-upload" className="edit-icon">
            <FiEdit2 size={20} />
          </label>
          <input id="profile-upload" type="file" accept="image/*" hidden onChange={handleFileChange} />
        </div>
        
        <div className="username-box">
          {editing.username ? (
            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          ) : (
            <h1>{user.username}</h1>
          )}
          <FiEdit2 size={20} className="edit-icon" onClick={() => setEditing({ ...editing, username: true })} />
        </div>
      </header>


      <h2 className="abb">About Me</h2>
      <section className="bio-section">
        <div className="bio-box">
          <div className="bio-header">
            <FiEdit3 size={20} className="edit-icon" onClick={() => setEditing({ ...editing, bio: true })} />
          </div>
          {editing.bio ? (
            <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} />
          ) : (
            <p>{user.bio || "This is my bio!"}</p>
          )}
        </div>
      </section>

      {(editing.username || editing.bio) && (
        <button onClick={handleProfileUpdate} className="save-button">Save</button>
      )}

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Profile;
