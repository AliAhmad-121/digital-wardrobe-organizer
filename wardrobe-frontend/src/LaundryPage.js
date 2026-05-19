import React, { useEffect, useState, useCallback } from "react";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { WashingMachine, CheckCircle, Loader2, RefreshCw } from "lucide-react";

export default function LaundryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLaundry = useCallback(async () => {
    const userId = localStorage.getItem("user_id");
    try {
      const res = await fetch(`http://127.0.0.1:8000/laundry/${userId}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching laundry:", error);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLaundry();
  }, [fetchLaundry]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLaundry();
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.includes("uploads")) {
      const filename = path.split(/[/\\]/).pop();
      return `http://127.0.0.1:8000/uploads/${filename}`;
    }
    return `http://127.0.0.1:8000${path}`;
  };

  const markClean = async (id) => {
    setCleaning(id);
    try {
      await fetch(`http://127.0.0.1:8000/toggle-laundry/${id}`, {
        method: "PUT",
      });
      fetchLaundry();
    } catch (error) {
      console.error("Error marking clean:", error);
    } finally {
      setCleaning(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-[#c08457] mx-auto mb-4" />
          <p className="text-gray-500">Loading laundry...</p>
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
            <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Laundry</h1>
            <p className="text-gray-500 mt-1">{items.length} items need washing</p>
          </div>

          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <div className="badge badge-warning">
                <WashingMachine className="w-4 h-4 mr-1" />
                {items.length} in basket
              </div>
            )}
            <Button variant="secondary" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All Clean!</h3>
            <p className="text-gray-500">No items in your laundry basket</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="garment-card">
                <div className="aspect-square bg-gray-50 overflow-hidden relative">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Laundry Overlay */}
                  <div className="absolute inset-0 bg-orange-500/10" />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-warning">
                      <WashingMachine className="w-3 h-3 mr-1" />
                      Dirty
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate mb-3">{item.name}</h3>
                  <Button
                    variant="success"
                    size="sm"
                    className="w-full"
                    onClick={() => markClean(item.id)}
                    disabled={cleaning === item.id}
                  >
                    {cleaning === item.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cleaning...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Mark Clean
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}