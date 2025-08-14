import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  logoutUser,
  getAvatarColor,
} from "../utils/authService";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Get current user on component mount
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = logoutUser();
      if (result.success) {
        setCurrentUser(null);
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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🔐</span>
            <span className="brand-text">AuthAI</span>
          </Link>
        </div>

        <div className="navbar-menu">
          {currentUser ? (
            // Authenticated user menu
            <>
              <div className="user-info">
                <span
                  className="user-avatar"
                  style={{ background: getAvatarColor(currentUser.name) }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
                <span className="user-name">Hi, {currentUser.name}</span>
              </div>

              <Link to="/profile" className="nav-link">
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="logout-button"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Signing Out..." : "Logout"}
              </button>
            </>
          ) : (
            // Guest user menu
            <>
              <Link to="/register" className="nav-link">
                Register
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
