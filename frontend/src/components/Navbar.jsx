import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="p-4 border-b flex items-center justify-between">
      <div className="font-bold">SMS</div>
      <div className="flex items-center gap-4">
        <Link to="/students">Students</Link>
        <Link to="/dashboard">Dashboard</Link>
        {user ? (
          <button onClick={handleLogout} className="text-sm text-red-600">
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
