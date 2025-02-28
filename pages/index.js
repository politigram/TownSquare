import React from "react";
import Navigation from "../components/Navigation"; // ✅ Import the Navigation Bar

export default function Home() {
  return (
    <div>
      <h1>Welcome to TownSquare</h1>
      <Navigation /> {/* ✅ Include the Navigation bar here */}
    </div>
  );
}

