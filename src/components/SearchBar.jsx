// src/components/SearchBar.jsx
import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div
      style={{
        padding: "0.85rem 1.25rem",
        background: "#faf8f5",
        borderBottom: "1px solid #e8e3db",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "0.85rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#a8a29e",
            fontSize: "1rem",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          ⌕
        </span>
        <input
          type="search"
          placeholder="Search dishes..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 1rem 0.6rem 2.2rem",
            border: "1px solid #e8e3db",
            borderRadius: 999,
            background: "#ffffff",
            fontSize: "0.9rem",
            color: "#1c1917",
            outline: "none",
            fontFamily: "inherit",
          }}
          aria-label="Search menu items"
        />
      </div>
    </div>
  );
}
