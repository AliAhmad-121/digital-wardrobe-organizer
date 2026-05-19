import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
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
  X,
  Sun,
  Moon,
  Palette
} from "lucide-react";
import { HexColorPicker } from "react-colorful";

// Pages
import Welcome from "./Welcome";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import AddGarment from "./AddGarment";
import RecommendOutfit from "./RecommendOutfit";
import SavedOutfits from "./SavedOutfits";
import Stats from "./Stats";
import Settings from "./Settings";
import WornPage from "./WornPage";
import LaundryPage from "./LaundryPage";

// Theme Context
const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  primaryColor: "#c08457",
  setPrimaryColor: () => {}
});

export function useTheme() {
  return useContext(ThemeContext);
}

// Theme Provider
function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#c08457");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedColor = localStorage.getItem("primaryColor");
    if (savedDarkMode) setDarkMode(savedDarkMode === "true");
    if (savedColor) setPrimaryColor(savedColor);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    localStorage.setItem("primaryColor", primaryColor);
    
    document.documentElement.classList.toggle("dark-mode", darkMode);
    document.documentElement.style.setProperty("--color-accent", primaryColor);
  }, [darkMode, primaryColor]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme Controls Component
function ThemeControls() {
  const { darkMode, setDarkMode, primaryColor, setPrimaryColor } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const location = useLocation();

  const hideOnPaths = ["/", "/login", "/signup"];
  if (hideOnPaths.includes(location.pathname)) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex items-center gap-3">
      {/* Dark Mode Toggle */}
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-md">
        <Sun className="w-4 h-4 text-yellow-500" />
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c08457]"></div>
        </label>
        <Moon className="w-4 h-4 text-gray-600" />
      </div>

      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <Palette className="w-4 h-4" style={{ color: primaryColor }} />
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: primaryColor }}
          />
        </button>

        {showColorPicker && (
          <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 z-50">
            <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
            <div className="flex gap-2 mt-3">
              {["#c08457", "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"].map((color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Navigation Component
function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { primaryColor } = useTheme();

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
    { path: "/settings", label: "Settings", icon: Palette },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
              >
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Wardrobe</span>
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
                  style={location.pathname === item.path ? { color: primaryColor, backgroundColor: `${primaryColor}15` } : {}}
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
      <nav className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
            >
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Wardrobe</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  style={location.pathname === item.path ? { backgroundColor: primaryColor } : {}}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <ThemeControls />
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
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;