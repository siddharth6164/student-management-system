// src/pages/StudentForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { toast } from "../utils/toast";

export default function StudentForm({ student }) {
  const [form, setForm] = useState(
    student || { name: "", email: "", age: "", class: "", phone: "" }
  );
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (student) {
      setForm(student);
    }
  }, [student]);

  const submit = async (e) => {
    e?.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.includes("@")) return toast.error("Invalid email");
    setLoading(true);
    try {
      if (student) {
        await api.put(`/students/${student._id}`, form);
        toast.success("Updated");
      } else {
        await api.post("/students", form);
        toast.success("Created");
      }
      nav("/students");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        {student ? "Edit" : "Add"} Student
      </h2>
      <label className="block mb-2">Name</label>
      <Input
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <label className="block mt-2 mb-2">Email</label>
      <Input
        required
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {student?.studentId && (
        <>
          <label className="block mt-2 mb-2">Student ID</label>
          <Input value={student.studentId} disabled />
        </>
      )}
      <label className="block mt-2 mb-2">Age</label>
      <Input
        type="number"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
      />
      <label className="block mt-2 mb-2">Class</label>
      <Input
        value={form.class}
        onChange={(e) => setForm({ ...form, class: e.target.value })}
      />
      <label className="block mt-2 mb-2">Phone</label>
      <Input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <div className="mt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}