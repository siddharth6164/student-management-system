// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";
import { toast } from "../utils/toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-sm mx-auto">
      <label className="block mb-2">Email</label>
      <Input
        className="mb-2"
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="block mb-2">Password</label>
      <Input
        className="mb-2"
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Signing..." : "Login"}
      </Button>
    </form>
  );
}