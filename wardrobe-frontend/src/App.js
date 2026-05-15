import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Sparkles,
  Plus,
  Bookmark,
  BarChart3,
  Clock,
  WashingMachine,
  Shirt,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

// Pages
import Welcome from "./Welcome";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import AddGarment from "./AddGarment";
import RecommendOutfit from "./RecommendOutfit";
import SavedOutfits from "./SavedOutfits";
import Stats from "./Stats";
import WornPage from "./WornPage";
import LaundryPage from "./LaundryPage";

// Navigation Component
function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide nav on auth pages
  const hideNavPaths = ["/", "/login", "/signup"];
  if (hideNavPaths.includes(location.pathname)) return null;

  const navItems = [
    { path: "/dashboard", label: "Closet", icon: LayoutDashboard },
    { path: "/recommend", label: "Outfits", icon: Sparkles },
    { path: "/add-garment", label: "Add", icon: Plus },
    { path: "/saved-outfits", label: "Saved", icon: Bookmark },
    { path: "/stats", label: "Stats", icon: BarChart3 },
    { path: "/worn", label: "Worn", icon: Clock },
    { path: "/laundry", label: "Laundry", icon: WashingMachine },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c08457] to-[#a56a45] flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Wardrobe</span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center gap-2 ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="nav-link flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c08457] to-[#a56a45] flex items-center justify-center">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Wardrobe</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-[#c08457]/10 text-[#c08457]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-garment" element={<AddGarment />} />
          <Route path="/recommend" element={<RecommendOutfit />} />
          <Route path="/saved-outfits" element={<SavedOutfits />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/worn" element={<WornPage />} />
          <Route path="/laundry" element={<LaundryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;