import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";

export default function SavedOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    fetch(`http://127.0.0.1:8000/saved-outfits/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOutfits(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    return `http://127.0.0.1:8000${path}`;
  };

  // 🔥 NEW: GROUP BY DATE
  const groupedOutfits = {};
  outfits.forEach((outfit) => {
    const date = outfit.date || "Unplanned";

    if (!groupedOutfits[date]) {
      groupedOutfits[date] = [];
    }

    groupedOutfits[date].push(outfit);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading saved outfits...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      
      {/* HEADER */}
      <h2 className="text-3xl font-bold tracking-tight">
        Saved Outfits
      </h2>

      {outfits.length === 0 ? (
        <div className="text-center text-gray-500">
          No saved outfits yet.
        </div>
      ) : (
        <div className="space-y-8">

          {/* 🔥 LOOP BY DATE */}
          {Object.keys(groupedOutfits).map((date) => (
            <div key={date}>

              {/* DATE TITLE */}
              <h3 className="text-lg font-semibold mb-3">
                📅 {date}
              </h3>

              <div className="space-y-4">

                {groupedOutfits[date].map((outfit) => (
                  <Card
                    key={outfit.id}
                    className="hover:shadow-lg transition"
                  >
                    <CardContent className="p-5 space-y-4">

                      {/* ITEMS */}
                      <div className="flex gap-4 flex-wrap">
                        {Array.isArray(outfit.items) &&
                          outfit.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col items-center group"
                            >
                              <div className="bg-gray-100 rounded-lg p-2 transition group-hover:scale-105">
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                  className="w-20 h-20 object-contain"
                                />
                              </div>

                              <span className="text-xs mt-2 text-gray-600 text-center">
                                {item.name}
                              </span>
                            </div>
                          ))}
                      </div>

                    </CardContent>
                  </Card>
                ))}

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}