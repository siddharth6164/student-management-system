import React from "react";

export default function Model({ children, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded max-w-md w-full">
        <div className="text-right">
          <button onClick={onClose}>Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}