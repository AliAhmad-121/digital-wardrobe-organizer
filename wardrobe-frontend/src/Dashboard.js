import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";
import { useNavigate } from "react-router-dom";

// ICONS
import { RefreshCw, Trash2, Plus } from "lucide-react";

export default function Dashboard() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const navigate = useNavigate();

  // 🔥 FIXED IMAGE HANDLER
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

  // 🔥 FILTER
  const filtered = clothes.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "All" || item.category === categoryFilter)
  );

  return (
  <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

    {/* HEADER */}
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold">Your Closet</h2>

      <div className="flex gap-2 flex-wrap">

        <Button
          variant="outline"
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          onClick={() => navigate("/laundry")}
        >
          🧺 Laundry
        </Button>

        <Button
          variant="outline"
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
          onClick={() => navigate("/worn")}
        >
          ✔ Worn
        </Button>

        <Button
          onClick={fetchClothes}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>

      </div>
    </div>

    {/* FILTER */}
    <Card>
      <CardContent className="p-4 flex gap-3 items-center">

        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Top">Top</option>
          <option value="Bottom">Bottom</option>
          <option value="Shoes">Shoes</option>
        </select>

      </CardContent>
    </Card>

    {/* GRID */}
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {filtered.map((item) => (

          <Card key={item.id}>
            <CardContent className="p-4 space-y-3">

              <img
                src={getImageUrl(item.image)}
                className="w-32 h-32 object-cover mx-auto"
                alt={item.name}
              />

              <h3 className="text-center">{item.name}</h3>

              <div className="flex flex-col gap-2">

                {/* DELETE */}
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                  onClick={() => {
                    fetch(`http://127.0.0.1:8000/clothes/${item.id}`, {
                      method: "DELETE",
                    });
                    fetchClothes();
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>

                {/* WORN */}
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => {
                    fetch(`http://127.0.0.1:8000/wear/${item.id}`, {
                      method: "POST",
                    }).then(() => {
                      alert("✔ Marked as worn");
                    });
                  }}
                >
                  ✔ Worn
                </Button>

                {/* LAUNDRY */}
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    fetch(`http://127.0.0.1:8000/toggle-laundry/${item.id}`, {
                      method: "PUT",
                    }).then(() => {
                      alert("🧺 Sent to laundry");
                      fetchClothes();
                    });
                  }}
                >
                  🧺 Laundry
                </Button>

                {/* ADD */}
                <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
                  <Plus size={14} />
                  Add
                </Button>

              </div>

            </CardContent>
          </Card>

        ))}

      </div>
    )}
  </div>
);}