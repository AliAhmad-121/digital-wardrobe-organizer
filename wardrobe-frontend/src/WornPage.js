import React, { useEffect, useState, useCallback } from "react";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Clock, CheckCircle, RefreshCw } from "lucide-react";

export default function WornPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorn = useCallback(async () => {
    const userId = localStorage.getItem("user_id");
    try {
      const res = await fetch(`http://127.0.0.1:8000/worn/${userId}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching worn items:", error);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWorn();
  }, [fetchWorn]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWorn();
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.includes("uploads")) {
      const filename = path.split(/[/\\]/).pop();
      return `http://127.0.0.1:8000/uploads/${filename}`;
    }
    return `http://127.0.0.1:8000${path}`;
  };

  // Group by relative time
  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return "This Week";
    if (diffDays < 30) return "This Month";
    return "Earlier";
  };

  const groupedItems = {};
  items.forEach((item) => {
    const group = item.last_worn ? getRelativeTime(item.last_worn) : "Never";
    if (!groupedItems[group]) {
      groupedItems[group] = [];
    }
    groupedItems[group].push(item);
  });

  const groupOrder = [
    "Today",
    "Yesterday",
    "This Week",
    "This Month",
    "Earlier",
    "Never",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-[#c08457] mx-auto mb-4" />
          <p className="text-gray-500">Loading recently worn items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container py-10 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">
              Recently Worn
            </h1>
            <p className="text-gray-500 mt-1">
              Track when you last wore each item
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Worn History
            </h3>
            <p className="text-gray-500">
              Start tracking by marking items as worn from your closet
            </p>
          </Card>
        ) : (
          <div className="space-y-10">
            {groupOrder
              .filter((group) => groupedItems[group]?.length > 0)
              .map((group) => (
                <div key={group} className="fade-in">
                  {/* Group Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {group}
                    </h2>
                    <span className="text-sm text-gray-400">
                      ({groupedItems[group].length} items)
                    </span>
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedItems[group].map((item) => (
                      <div key={item.id} className="garment-card">
                        <div className="aspect-square bg-gray-50 overflow-hidden relative">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2">
                            <span className="badge badge-success text-xs">
                              {(item.wear_count || item.count || 1)}x worn
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {item.name}
                          </h3>
                          {item.last_worn && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(item.last_worn).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}