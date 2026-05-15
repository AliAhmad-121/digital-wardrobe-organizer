import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Trash2,
  Plus,
  Search,
  Filter,
  Shirt,
  CheckCircle,
  WashingMachine,
  MoreVertical,
  X
} from "lucide-react";

export default function Dashboard() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);

  const navigate = useNavigate();

  const categories = ["All", "Top", "Bottom", "Shoes", "Outerwear", "Accessories"];

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.includes("uploads")) {
      const filename = image.split(/[/\\]/).pop();
      return `http://127.0.0.1:8000/uploads/${filename}`;
    }
    return `http://127.0.0.1:8000/uploads/fallback.jpg`;
  };

  const fetchClothes = async () => {
    const userId = localStorage.getItem("user_id");
    const res = await fetch(`http://127.0.0.1:8000/clothes/${userId}`);
    const data = await res.json();
    setClothes(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const filtered = clothes.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "All" || item.category === categoryFilter)
  );

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/clothes/${id}`, { method: "DELETE" });
    fetchClothes();
    setActiveMenu(null);
  };

  const handleWorn = async (id) => {
    await fetch(`http://127.0.0.1:8000/wear/${id}`, { method: "POST" });
    setActiveMenu(null);
  };

  const handleLaundry = async (id) => {
    await fetch(`http://127.0.0.1:8000/toggle-laundry/${id}`, { method: "PUT" });
    fetchClothes();
    setActiveMenu(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container py-10 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-gray-900">Your Closet</h1>
            <p className="text-gray-500 mt-1">{clothes.length} items in your wardrobe</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="warning" onClick={() => navigate("/laundry")}>
              <WashingMachine className="w-4 h-4" />
              Laundry
            </Button>

            <Button variant="success" onClick={() => navigate("/worn")}>
              <CheckCircle className="w-4 h-4" />
              Recently Worn
            </Button>

            <Button variant="secondary" onClick={fetchClothes}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>

            <Button onClick={() => navigate("/add-garment")}>
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="p-5">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search your closet..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        categoryFilter === cat
                          ? "bg-[#c08457] text-white"
                          : "bg-white/50 text-gray-600 hover:bg-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="spinner border-[#c08457]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Shirt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-6">
              {search || categoryFilter !== "All"
                ? "Try adjusting your filters"
                : "Start building your digital wardrobe"}
            </p>
            <Button onClick={() => navigate("/add-garment")}>
              <Plus className="w-4 h-4" />
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="garment-card group">
                {/* Image Container */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={getImageUrl(item.image)}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                    {/* Menu Button */}
                    <button
                      onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
                    >
                      {activeMenu === item.id ? (
                        <X className="w-4 h-4 text-gray-600" />
                      ) : (
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenu === item.id && (
                      <div className="absolute top-12 right-3 bg-white rounded-xl shadow-lg py-2 min-w-[140px] z-10">
                        <button
                          onClick={() => handleWorn(item.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Mark Worn
                        </button>
                        <button
                          onClick={() => handleLaundry(item.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <WashingMachine className="w-4 h-4 text-orange-500" />
                          To Laundry
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  <span className="absolute bottom-3 left-3 badge badge-accent">
                    {item.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                  {item.price && (
                    <p className="text-sm text-gray-500 mt-1">${item.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}