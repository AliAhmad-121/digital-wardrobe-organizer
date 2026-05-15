import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Calendar,
  Sparkles,
  Save,
  CheckCircle,
  RefreshCw,
  MapPin,
  Loader2
} from "lucide-react";

export default function RecommendOutfit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("London");
  const [selectedDate, setSelectedDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [wearing, setWearing] = useState(false);

  const getImageUrl = (path) => {
    if (!path) return null;
    return `http://127.0.0.1:8000${path}`;
  };

  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("rain")) return CloudRain;
    if (cond.includes("snow")) return Snowflake;
    if (cond.includes("cloud")) return Cloud;
    if (cond.includes("wind")) return Wind;
    return Sun;
  };

  const wearOutfit = async () => {
    setWearing(true);
    const ids = data.outfit.map((item) => item.id);
    await fetch("http://127.0.0.1:8000/wear-outfit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: ids }),
    });
    setWearing(false);
  };

  const saveOutfit = async () => {
    setSaving(true);
    const userId = localStorage.getItem("user_id");
    const ids = data.outfit.map((item) => item.id);
    await fetch("http://127.0.0.1:8000/save-outfit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        items: ids,
        date: selectedDate,
      }),
    });
    setSaving(false);
  };

  const fetchOutfit = useCallback(() => {
    const userId = localStorage.getItem("user_id");
    setLoading(true);
    fetch(`http://127.0.0.1:8000/recommend-outfit/${userId}/${encodeURIComponent(city)}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  useEffect(() => {
    fetchOutfit();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-[#c08457] mx-auto mb-4" />
          <p className="text-gray-500">Generating your perfect outfit...</p>
        </div>
      </div>
    );
  }

  if (!data || data.message || data.detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Outfit Available</h3>
          <p className="text-gray-500 mb-6">{data?.message || "Add more items to your wardrobe to get recommendations"}</p>
          <Button onClick={fetchOutfit}>
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(data.weather?.condition);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container py-10 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-serif font-medium text-gray-900">Today&apos;s Perfect Outfit</h1>
          <p className="text-gray-500 mt-2">Based on weather, style matching, and your preferences</p>
        </div>

        {/* Controls Card */}
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* City Input */}
              <div className="relative flex-1 min-w-[200px]">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city..."
                  className="pl-11"
                />
              </div>

              <Button variant="secondary" onClick={fetchOutfit}>
                <RefreshCw className="w-4 h-4" />
                Update
              </Button>

              {/* Date Picker */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-11 w-[180px]"
                />
              </div>

              <Button variant="secondary" onClick={saveOutfit} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </Button>

              <Button variant="success" onClick={wearOutfit} disabled={wearing}>
                {wearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Wear Outfit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weather Card */}
        {data.weather && (
          <div className="flex justify-center">
            <div className="glass-card px-8 py-4 inline-flex items-center gap-4">
              <WeatherIcon className="w-8 h-8 text-[#c08457]" />
              <div>
                <div className="text-2xl font-medium text-gray-900">{data.weather.temp}C</div>
                <div className="text-sm text-gray-500">{data.weather.condition}</div>
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        {data.explanation && (
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c08457]" />
              Why This Outfit?
            </h3>
            <div className="space-y-2">
              {data.explanation.map((e, i) => (
                <p key={i} className="text-gray-600 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c08457] mt-2 flex-shrink-0" />
                  {e}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Outfit Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.outfit.map((item) => (
              <div key={item.id} className="garment-card">
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}