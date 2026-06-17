// src/components/MenuSection.jsx
import React from "react";
import MenuCard from "./MenuCard";
import { categories } from "../data/menuData";

export default function MenuSection({ items, activeCategory, currency }) {
  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category === activeCategory);

  if (activeCategory !== "all") {
    return (
      <section style={{ padding: "1.5rem 1.25rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} currency={currency} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div style={{ padding: "1.5rem 1.25rem" }}>
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category === cat.id);
        if (!catItems.length) return null;
        return (
          <section key={cat.id} style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#1c1917",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #e8e3db",
                position: "relative",
              }}
            >
              {cat.label}
              <span
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  width: 40,
                  height: 2,
                  background: "#b85c2a",
                }}
              />
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {catItems.map((item) => (
                <MenuCard key={item.id} item={item} currency={currency} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
