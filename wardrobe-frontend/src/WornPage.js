import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";

export default function WornPage() {
  const [wornItems, setWornItems] = useState([]);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    fetch(`http://127.0.0.1:8000/laundry/${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setWornItems(Array.isArray(data.worn) ? data.worn : []);
      });
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "http://127.0.0.1:8000/uploads/fallback.jpg";
    return path.startsWith("/uploads")
      ? `http://127.0.0.1:8000${path}`
      : "http://127.0.0.1:8000/uploads/fallback.jpg";
  };
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* HEADER */}
      <h2 className="text-3xl font-bold tracking-tight">
        Recently Worn 👕
      </h2>

      {/* CONTENT */}
      {wornItems.length === 0 ? (
        <p className="text-gray-500 text-center">
          No worn items yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {wornItems.map((item, i) => (
            <Card key={i} className="hover:shadow-lg transition">
              <CardContent className="p-4 text-center space-y-3">

                {/* IMAGE */}
                <div className="bg-[#f9f7f4] rounded-xl p-3">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="h-28 object-contain mx-auto"
                  />
                </div>

                {/* NAME */}
                <p className="text-sm font-medium">
                  {item.name}
                </p>

                {/* DATE */}
                <p className="text-xs text-gray-500">
                  {item.date}
                </p>

              </CardContent>
            </Card>
          ))}

        </div>
      )}

    </div>
  );
}

// update: UI tweak for worn page