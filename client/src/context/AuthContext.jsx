import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (userData) => {
    // Handle JSON vs FormData
    let body = userData;
    let headers = {};

    if (!(userData instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(userData);
    }

    const res = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const data = await res.json();

    if (res.ok) {
      // Do NOT auto login
      return data;
    } else {
      console.error("Register Error:", data.message);
      throw new Error(data.message);
    }
  };

  const login = async (userData) => {
    console.log("Logging in...", userData);
    const res = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } else {
      console.error("Login Error:", data.message);
      throw new Error(data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Update Profile Function
  const updateProfile = async (formData) => {
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } else {
      throw new Error(data.message);
    }
  };

  // Refresh User Data (for Badges/Streak)
  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        // Preserve token as getMe might not return it or returns complete user object
        // Actually getMe returns req.user which has the mongoose doc.
        // We need to ensure we keep the token.
        const updatedUser = { ...data, token: user.token };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        register,
        login,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
