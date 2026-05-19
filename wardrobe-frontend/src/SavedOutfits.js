import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Calendar, Bookmark, Trash2, Loader2 } from "lucide-react";

export default function SavedOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchOutfits = () => {
    const userId = localStorage.getItem("user_id");
    setLoading(true);

    fetch(`http://127.0.0.1:8000/saved-outfits/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOutfits(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    return `http://127.0.0.1:8000${path}`;
  };

  const handleDeleteOutfit = async (outfitId) => {
    setDeleting(outfitId);
    try {
      await fetch(`http://127.0.0.1:8000/saved-outfits/${outfitId}`, {
        method: "DELETE",
      });
      fetchOutfits();
    } catch (error) {
      console.error("Error deleting outfit:", error);
    } finally {
      setDeleting(null);
    }
  };

  // Group by date
  const groupedOutfits = {};
  outfits.forEach((outfit) => {
    const date = outfit.date || "Unplanned";
    if (!groupedOutfits[date]) {
      groupedOutfits[date] = [];
    }
    groupedOutfits[date].push(outfit);
  });

  const formatDate = (dateStr) => {
    if (dateStr === "Unplanned") return dateStr;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-[#c08457] mx-auto mb-4" />
          <p className="text-gray-500">Loading saved outfits...</p>
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
        <div>
          <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white">Saved Outfits</h1>
          <p className="text-gray-500 mt-1">{outfits.length} outfits saved for later</p>
        </div>

        {outfits.length === 0 ? (
          <Card className="p-12 text-center">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Saved Outfits</h3>
            <p className="text-gray-500">Save outfits from recommendations to plan your looks ahead</p>
          </Card>
        ) : (
          <div className="space-y-10">
            {Object.keys(groupedOutfits)
              .sort((a, b) => {
                if (a === "Unplanned") return 1;
                if (b === "Unplanned") return -1;
                return new Date(a) - new Date(b);
              })
              .map((date) => (
                <div key={date} className="fade-in">
                  {/* Date Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c08457]/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#c08457]" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">{formatDate(date)}</h2>
                  </div>

                  {/* Outfits for this date */}
                  <div className="space-y-4">
                    {groupedOutfits[date].map((outfit) => (
                      <Card key={outfit.id} className="p-6">
                        <CardContent className="p-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4 flex-wrap flex-1">
                              {Array.isArray(outfit.items) &&
                                outfit.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="group relative"
                                  >
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50">
                                      <img
                                        src={getImageUrl(item.image)}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2 block text-center truncate w-24">
                                      {item.name}
                                    </span>
                                  </div>
                                ))}
                            </div>
                            
                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOutfit(outfit.id)}
                              disabled={deleting === outfit.id}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              {deleting === outfit.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
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
    </div>
  );
}