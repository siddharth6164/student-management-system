import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import { toast } from "../utils/toast";

export default function Dashboard() {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/students?page=1&limit=1");
      setTotal(res.data.total ?? 0);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link to="/students/new">
            <Button>Add Student</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Students</div>
            <div className="text-3xl font-bold">
              {loading ? "..." : total ?? "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}