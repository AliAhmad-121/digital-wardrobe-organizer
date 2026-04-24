import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";

export default function LaundryPage() {
  const [data, setData] = useState({ worn: [], laundry: [] });

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    fetch(`http://127.0.0.1:8000/laundry/${user_id}`)
      .then((res) => res.json())
      .then((resData) => {
        setData({
          worn: Array.isArray(resData.worn) ? resData.worn : [],
          laundry: Array.isArray(resData.laundry) ? resData.laundry : [],
        });
      });
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    return `http://127.0.0.1:8000${path}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* HEADER */}
      <h2 className="text-3xl font-bold tracking-tight">
        Laundry 🧺
      </h2>

      <div className="space-y-4">

        {data.laundry.length === 0 ? (
          <p className="text-gray-500 text-center">
            No items in laundry 🎉
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {data.laundry.map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition">
                <CardContent className="p-4 text-center space-y-3">

                  <div className="bg-[#f9f7f4] rounded-xl p-3">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="h-28 object-contain mx-auto"
                    />
                  </div>

                  <p className="text-sm font-medium">
                    {item.name}
                  </p>

                  {/* 🔥 CLEAN BUTTON */}
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition"
                    onClick={() => {
                      fetch(`http://127.0.0.1:8000/toggle-laundry/${item.id}`, {
                        method: "PUT",
                      }).then(() => {
                        // remove from UI instantly
                        setData((prev) => ({
                          ...prev,
                          laundry: prev.laundry.filter(
                            (g) => g.id !== item.id
                          ),
                        }));
                      });
                    }}
                  >
                    ✅ Clean
                  </button>

                </CardContent>
              </Card>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}