import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={
        "border px-3 py-2 rounded w-full focus:outline-none focus:ring " +
        className
      }
    />
  );
}