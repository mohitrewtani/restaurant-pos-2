// src/components/CategoryTabs.jsx
import React from "react";
import { categories } from "../data/menuData";

export default function CategoryTabs({ active, onChange }) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#ffffff",
        borderBottom: "1px solid #e8e3db",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
      aria-label="Menu categories"
    >
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          padding: "0.75rem 1.25rem",
          minWidth: "max-content",
        }}
      >
        <TabBtn
          label="All"
          id="all"
          active={active === "all"}
          onClick={() => onChange("all")}
        />
        {categories.map((cat) => (
          <TabBtn
            key={cat.id}
            label={cat.label}
            id={cat.id}
            active={active === cat.id}
            onClick={() => onChange(cat.id)}
          />
        ))}
      </div>
    </nav>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.45rem 1rem",
        borderRadius: 999,
        border: active ? "none" : "1px solid #e8e3db",
        background: active ? "#b85c2a" : "transparent",
        color: active ? "#fff" : "#78716c",
        fontSize: "0.85rem",
        fontWeight: active ? 600 : 400,
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
      aria-current={active ? "true" : undefined}
    >
      {label}
    </button>
  );
}
