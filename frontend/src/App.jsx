import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import Navbar from "./components/Navbar";
import useAuth from "./hooks/useAuth";
import { useEffect, useState } from "react";
import api from "./api/axios";
import { toast } from "./utils/toast";

function StudentFormEdit() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/students/${id}`);
        setStudent(res.data);
      } catch (err) {
        toast.error("Failed to load student");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!student) return <div className="p-4">Student not found</div>;
  return <StudentForm student={student} />;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/students/new"
            element={
              <PrivateRoute>
                <StudentForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <PrivateRoute>
                <StudentFormEdit />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;