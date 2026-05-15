import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Shirt,
  DollarSign,
  Calendar,
  Sparkles
} from "lucide-react";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    fetch(`http://127.0.0.1:8000/stats/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-[#c08457] mx-auto mb-4" />
          <p className="text-gray-500">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const categoryColors = {
    Top: "#c08457",
    Bottom: "#6366f1",
    Shoes: "#10b981",
    Outerwear: "#f59e0b",
    Accessories: "#ec4899",
  };

  const totalItems = stats?.category_breakdown
    ? Object.values(stats.category_breakdown).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container py-10 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-sm text-gray-600 mb-4">
            <Sparkles className="w-4 h-4 text-[#c08457]" />
            Wardrobe Insights
          </div>
          <h1 className="text-3xl font-serif font-medium text-gray-900">Your Style Analytics</h1>
          <p className="text-gray-500 mt-2">Understand your fashion habits and spending</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c08457]/10 flex items-center justify-center">
                <Shirt className="w-5 h-5 text-[#c08457]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${stats?.total_value || 0}</p>
                <p className="text-sm text-gray-500">Total Value</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.avg_cost_per_wear || 0}</p>
                <p className="text-sm text-gray-500">Avg Cost/Wear</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_wears || 0}</p>
                <p className="text-sm text-gray-500">Total Wears</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-[#c08457]" />
                <h3 className="font-medium text-gray-900">Category Breakdown</h3>
              </div>

              {stats?.category_breakdown ? (
                <div className="space-y-4">
                  {Object.entries(stats.category_breakdown).map(([category, count]) => {
                    const percentage = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{category}</span>
                          <span className="text-gray-900 font-medium">{count} items ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: categoryColors[category] || "#c08457",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No category data available</p>
              )}
            </CardContent>
          </Card>

          {/* Cost Per Wear */}
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-[#c08457]" />
                <h3 className="font-medium text-gray-900">Cost Per Wear Analysis</h3>
              </div>

              {stats?.cost_per_wear ? (
                <div className="space-y-4">
                  {stats.cost_per_wear.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img
                            src={`http://127.0.0.1:8000${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.wear_count || 0} wears</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${item.cost_per_wear || 0}</p>
                        <p className="text-xs text-gray-500">per wear</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No cost data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Most Worn Items */}
        {stats?.most_worn && stats.most_worn.length > 0 && (
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#c08457]" />
                <h3 className="font-medium text-gray-900">Most Worn Items</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.most_worn.slice(0, 5).map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden mb-2">
                      {item.image && (
                        <img
                          src={`http://127.0.0.1:8000${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.wear_count} times</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}