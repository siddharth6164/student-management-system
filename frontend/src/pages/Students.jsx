
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { toast } from "../utils/toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // 🔹 Debounce search (1.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/students?search=${encodeURIComponent(
          debouncedSearch
        )}&page=${page}&limit=10`
      );
      setStudents(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Call API when debouncedSearch or page changes
  useEffect(() => {
    fetchStudents();
  }, [debouncedSearch, page]);

  // 🔹 Delete student
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    setDeleting(id);
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      toast.success("Student deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Students</h2>
          <Link to="/students/new">
            <Button>Add Student</Button>
          </Link>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search by ID, name, email, phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Searching after few seconds...
            </p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Roll Number</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Age</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-center">Update</th>
                  <th className="px-4 py-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-6 text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s._id} className="border-t">
                      <td className="px-4 py-3">
                        {s.studentId ? `#${s.studentId}` : "-"}
                      </td>
                      <td className="px-4 py-3">{s.name}</td>
                      <td className="px-4 py-3">{s.email}</td>
                      <td className="px-4 py-3">{s.class || "-"}</td>
                      <td className="px-4 py-3">{s.age ?? "-"}</td>
                      <td className="px-4 py-3">{s.phone}</td>
                      <td className="px-4 py-3 text-center">
                        <Link to={`/students/${s._id}`}>
                          <FiEdit2 className="text-blue-600" />
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteStudent(s._id)}
                          disabled={deleting === s._id}
                        >
                          <FiTrash2 className="text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div>Page {page}</div>
          <div className="flex gap-2">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              disabled={students.length < 10}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
