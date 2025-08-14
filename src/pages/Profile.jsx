import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  logoutUser,
  getAvatarColor,
} from "../utils/authService";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Get current user data
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = logoutUser();
      if (result.success) {
        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Logout failed:", result.error);
        // Still redirect even if logout fails
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div
            className="profile-avatar"
            style={{ background: getAvatarColor(user.name) }}
          >
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <h1>Welcome, {user.name}!</h1>
          <p className="profile-subtitle">
            Here&apos;s your profile information
          </p>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>Full Name</label>
            <div className="info-value">{user.name}</div>
          </div>

          <div className="info-group">
            <label>Email Address</label>
            <div className="info-value">{user.email}</div>
          </div>

          <div className="info-group">
            <label>Member Since</label>
            <div className="info-value">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button
            onClick={handleLogout}
            className="logout-btn"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
