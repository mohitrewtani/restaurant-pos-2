// src/components/QRPage.jsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { restaurant } from "../data/menuData";

export default function QRPage() {
  const menuUrl = window.location.origin;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e8e3db",
          borderRadius: 16,
          padding: "2.5rem 2rem",
          textAlign: "center",
          maxWidth: 340,
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.6rem",
            color: "#1c1917",
            marginBottom: "0.3rem",
          }}
        >
          {restaurant.name}
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#78716c", marginBottom: "1.75rem" }}>
          Scan to explore our menu
        </p>

        <div
          style={{
            background: "#fff",
            display: "inline-block",
            padding: 16,
            borderRadius: 10,
            border: "1px solid #e8e3db",
            marginBottom: "1.5rem",
          }}
        >
          <QRCodeSVG
            value={menuUrl}
            size={200}
            fgColor="#1c1917"
            bgColor="#ffffff"
            level="H"
          />
        </div>

        <p style={{ fontSize: "0.75rem", color: "#a8a29e", wordBreak: "break-all" }}>
          {menuUrl}
        </p>
      </div>

      <p style={{ fontSize: "0.8rem", color: "#a8a29e", textAlign: "center" }}>
        Print this card and place it on your tables
      </p>
    </div>
  );
}
