import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import Welcome from "./Welcome";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import AddGarment from "./AddGarment";
import RecommendOutfit from "./RecommendOutfit";
import Stats from "./Stats";
import SavedOutfits from "./SavedOutfits";
import LaundryPage from "./LaundryPage";
import WornPage from "./WornPage";

/* ============================= */
/* NAVBAR */
/* ============================= */
function Navbar() {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/login", "/signup"];

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">

      <h2>👗 Digital Wardrobe</h2>

      <div className="nav-links">

        <Link
          to="/dashboard"
          style={{ opacity: isActive("/dashboard") ? 1 : 0.7 }}
        >
          Dashboard
        </Link>

        <Link
          to="/add"
          style={{ opacity: isActive("/add") ? 1 : 0.7 }}
        >
          Add
        </Link>

        <Link
          to="/outfit"
          style={{ opacity: isActive("/outfit") ? 1 : 0.7 }}
        >
          Outfit
        </Link>

        <Link
          to="/stats"
          style={{ opacity: isActive("/stats") ? 1 : 0.7 }}
        >
          Stats
        </Link>

        {/* 🔥 NEW: SAVED OUTFITS TAB */}
        <Link
          to="/saved-outfits"
          style={{ opacity: isActive("/saved-outfits") ? 1 : 0.7 }}
        >
          Saved
        </Link>

      </div>

    </nav>
  );
}

/* ============================= */
/* BACKGROUND */
/* ============================= */
function Background() {
  return (
    <div className="background-blobs">
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>
    </div>
  );
}

/* ============================= */
/* APP */
/* ============================= */
function App() {
  return (
    <Router>

      {/* Background */}
      <Background />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container">

        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddGarment />} />
          <Route path="/outfit" element={<RecommendOutfit />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/saved-outfits" element={<SavedOutfits />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/laundry" element={<LaundryPage />} />
          <Route path="/worn" element={<WornPage />} />
        </Routes>

      </main>

    </Router>
  );
}

export default App;