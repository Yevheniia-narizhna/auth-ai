// Authentication service for managing user registration, login, and logout
// Uses localStorage to persist user data

// Initialize users array in localStorage if it doesn't exist
const initializeUsers = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
  }
};

// Get users array from localStorage
const getUsers = () => {
  initializeUsers();
  return JSON.parse(localStorage.getItem("users")) || [];
};

// Save users array to localStorage
const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// Register a new user
export const registerUser = ({ name, email, password }) => {
  try {
    // Validate input
    if (!name || !email || !password) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Validate password length
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      };
    }

    const users = getUsers();

    // Check if email already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // In a real app, this should be hashed
      createdAt: new Date().toISOString(),
    };

    // Add user to array
    users.push(newUser);
    saveUsers(users);

    // Return success without password
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch {
    return {
      success: false,
      error: "Registration failed. Please try again.",
    };
  }
};

// Login user
export const loginUser = ({ email, password }) => {
  try {
    // Validate input
    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    const users = getUsers();

    // Find user by email
    const user = users.find(
      (user) => user.email === email.toLowerCase().trim()
    );

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check password
    if (user.password !== password) {
      return {
        success: false,
        error: "Invalid password",
      };
    }

    // Store current user in localStorage (without password)
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch {
    return {
      success: false,
      error: "Login failed. Please try again.",
    };
  }
};

// Logout user
export const logoutUser = () => {
  try {
    localStorage.removeItem("currentUser");
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch {
    return {
      success: false,
      error: "Logout failed",
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      return null;
    }
    return JSON.parse(currentUser);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Update user profile (optional utility function)
export const updateUserProfile = (userId, updates) => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsers(users);

    // Update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      // eslint-disable-next-line no-unused-vars
      const { password: _, ...userWithoutPassword } = users[userIndex];
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    }

    return {
      success: true,
      user: users[userIndex],
    };
  } catch {
    return {
      success: false,
      error: "Update failed",
    };
  }
};

// Utility function to generate colors based on first letter of name
export const getAvatarColor = (name) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#D7BDE2",
    "#A9CCE3",
    "#FAD7A0",
    "#ABEBC6",
    "#F5B7B1",
    "#AED6F1",
    "#D5A6BD",
    "#A2D9CE",
    "#F9E79F",
    "#D2B4DE",
    "#A9DFBF",
    "#F5CBA7",
    "#85C1E9",
    "#D7BDE2",
    "#A9CCE3",
    "#FAD7A0",
  ];

  if (!name || name.length === 0) {
    return colors[0];
  }

  const firstLetter = name.charAt(0).toUpperCase();
  const charCode = firstLetter.charCodeAt(0);
  const colorIndex = (charCode - 65) % colors.length; // A=65, so A=0, B=1, etc.

  return colors[colorIndex];
};
