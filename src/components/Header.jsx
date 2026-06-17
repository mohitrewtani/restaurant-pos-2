// src/components/Header.jsx
import React from "react";
import { restaurant } from "../data/menuData";

const styles = {
  header: {
    background: "#1c1917",
    color: "#faf8f5",
    textAlign: "center",
    padding: "2.5rem 1.5rem 2rem",
  },
  name: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(2rem, 6vw, 3rem)",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    color: "#faf8f5",
    marginBottom: "0.4rem",
  },
  tagline: {
    fontSize: "0.95rem",
    color: "#a8a29e",
    fontStyle: "italic",
    marginBottom: "1.25rem",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem 2rem",
    fontSize: "0.82rem",
    color: "#d6d3d1",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#b85c2a",
    display: "inline-block",
  },
};

export default function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.name}>{restaurant.name}</h1>
      <p style={styles.tagline}>{restaurant.tagline}</p>
      <div style={styles.meta}>
        <span style={styles.metaItem}>
          <span style={styles.dot} />
          {restaurant.address}
        </span>
        <span style={styles.metaItem}>
          <span style={styles.dot} />
          {restaurant.hours}
        </span>
        <span style={styles.metaItem}>
          <span style={styles.dot} />
          {restaurant.phone}
        </span>
      </div>
    </header>
  );
}
