import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function RecommendOutfit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("London");
  const [selectedDate, setSelectedDate] = useState("");

  const getImageUrl = (path) => {
    if (!path) return null;
    return `http://127.0.0.1:8000${path}`;
  };

  const markAsWorn = async (id) => {
    await fetch(`http://127.0.0.1:8000/wear/${id}`, {
      method: "POST",
    });
  };

  const wearOutfit = async () => {
    const ids = data.outfit.map((item) => item.id);

    await fetch("http://127.0.0.1:8000/wear-outfit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: ids }),
    });

    alert("Outfit worn ✅");
  };

  const saveOutfit = async () => {
    const userId = localStorage.getItem("user_id");
    const ids = data.outfit.map((item) => item.id);

    await fetch("http://127.0.0.1:8000/save-outfit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        items: ids,
        date: selectedDate,
      }),
    });

    alert("Outfit saved ✅");
  };

  const fetchOutfit = useCallback(() => {
    const userId = localStorage.getItem("user_id");
    setLoading(true);

    fetch(
      `http://127.0.0.1:8000/recommend-outfit/${userId}/${encodeURIComponent(city)}`
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  useEffect(() => {
    fetchOutfit();
  }, []); // ✅ FIXED WARNING

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Generating outfit...
      </div>
    );
  }

  if (!data || data.message || data.detail) {
    return (
      <div className="text-center text-gray-500">
        {data?.message || "No outfit available"}
      </div>
    );
  }

  const mainItem = data.outfit[0];
  const restItems = data.outfit.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      <h2 className="text-3xl font-bold text-center">
        Recommended Outfit 👕
      </h2>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center justify-center">

          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
            className="w-[200px]"
          />

          <Button onClick={fetchOutfit}>
            Update
          </Button>

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <Button onClick={saveOutfit}>
            💾 Save
          </Button>

          <Button onClick={wearOutfit} className="bg-green-500 text-white">
            ✔ Wear Outfit
          </Button>

        </CardContent>
      </Card>

      <div className="text-center text-gray-500">
        {data.weather ? (
          <p>{data.weather.temp}°C • {data.weather.condition}</p>
        ) : (
          <p className="text-red-500">Weather error</p>
        )}
        </div>
        <div className="text-center text-green-600 font-medium">
         ✅     Best outfit selected using color matching & scoring
         </div>

      {data.explanation && (
        <div className="text-center text-sm text-gray-500">
          {data.explanation.map((e, i) => (
            <p key={i}>💡 {e}</p>
          ))}
        </div>
      )}

      {/* ✅ FIXED GRID + ALIGNMENT */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          <Card className="w-[200px] h-[280px] flex flex-col">
            <CardContent className="flex flex-col items-center justify-between h-full p-4">

              <img
                src={getImageUrl(mainItem.image)}
                alt={mainItem.name}
                className="h-36 object-contain"
              />

              <p className="text-center">{mainItem.name}</p>

              <Button onClick={() => markAsWorn(mainItem.id)}>
                Worn ✓
              </Button>

            </CardContent>
          </Card>

          {restItems.map((item) => (
            <Card key={item.id} className="w-[200px] h-[280px] flex flex-col">
              <CardContent className="flex flex-col items-center justify-between h-full p-4">

                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-36 object-contain"
                />

                <p className="text-center">{item.name}</p>

                <Button onClick={() => markAsWorn(item.id)}>
                  Worn ✓
                </Button>

              </CardContent>
            </Card>
          ))}

        </div>
      </div>

    </div>
  );
}