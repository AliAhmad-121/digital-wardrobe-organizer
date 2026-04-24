import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    fetch(`http://127.0.0.1:8000/stats/overview/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data || {});
        setLoading(false);
      })
      .catch(() => {
        setStats({});
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading statistics...
      </div>
    );
  }

  const {
    total_garments = 0,
    total_wears = 0,
    most_worn = null,
    never_worn_items = [],
    // 🔥 NEW
    rotation_rate = 0,
    total_value = 0,
    insights = [],
    // 🆕 ADD THIS
    last_worn_items = [],
    // 🆕 ADD THIS
    recent_activity = [],
  } = stats || {};

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* HEADER */}
      <h2 className="text-3xl font-bold tracking-tight">
        Wardrobe Statistics
      </h2>

      {/* TOP STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="text-2xl">👕</div>
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <h3 className="text-2xl font-bold">{total_garments}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="text-2xl">🔁</div>
            <div>
              <p className="text-sm text-gray-500">Total Wears</p>
              <h3 className="text-2xl font-bold">{total_wears}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="text-2xl">⭐</div>
            <div>
              <p className="text-sm text-gray-500">Most Worn</p>
              {most_worn ? (
                <p className="font-medium">Item #{most_worn}</p>
              ) : (
                <p className="text-sm text-gray-400">No data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔥 NEW ADVANCED STATS */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">💰 Total Value</p>
            <h3 className="text-xl font-bold">${total_value}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">🔁 Rotation Rate</p>
            <h3 className="text-xl font-bold">{rotation_rate}</h3>
          </CardContent>
        </Card>
      </div>

      {/* NEVER WORN */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Never Worn Items</h3>

          {never_worn_items.length === 0 ? (
            <p className="text-gray-500 text-sm">
              🎉 Everything has been worn!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {never_worn_items.map((item, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-3 py-1 rounded-full text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔥 NEW INSIGHTS */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Insights</h3>

          {insights.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No insights yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {insights.map((insight, i) => (
                <li key={i} className="text-sm">
                  👉 {insight}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 🆕 LAST WORN */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Last Worn</h3>

          {last_worn_items.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No wear history yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {last_worn_items.map((item, i) => (
                <li key={i} className="text-sm">
                  🕒 {item.name} — {item.date}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 🆕 NEW: RECENT ACTIVITY (ONLY ADDED) */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Recent Activity</h3>

          {recent_activity.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No recent activity.
            </p>
          ) : (
            <ul className="space-y-2">
              {recent_activity.map((item, i) => (
                <li key={i} className="text-sm">
                  👕 {item.name} worn on {item.date}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

    </div>
  );
}