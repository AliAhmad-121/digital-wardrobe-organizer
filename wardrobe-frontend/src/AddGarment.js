import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Upload,
  ImageIcon,
  DollarSign,
  Tag,
  Shirt,
  X,
  Loader2,
  Sparkles
} from "lucide-react";

export default function AddGarment({ refreshClothes }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: "Top", icon: Shirt, label: "Top" },
    { value: "Bottom", icon: Shirt, label: "Bottom" },
    { value: "Shoes", icon: Shirt, label: "Shoes" },
    { value: "Outerwear", icon: Shirt, label: "Outerwear" },
    { value: "Accessories", icon: Shirt, label: "Accessories" },
  ];

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      setMessage("You must login first");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!file || !name || !category) {
      setMessage("Please fill all required fields");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("user_id", user_id);
    formData.append("file", file);
    formData.append("price", price || 0);
    formData.append("brand", brand);
    formData.append("season", season);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-garment", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.detail?.[0]?.msg || "Upload failed");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (data.duplicate) {
        setMessage(data.duplicate);
        setMessageType("warning");
      } else {
        setMessage("Garment uploaded successfully!");
        setMessageType("success");
      }

      setName("");
      setCategory("");
      setFile(null);
      setPreview(null);
      setPrice("");
      setBrand("");
      setSeason("");

      if (refreshClothes) refreshClothes();
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container py-10 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-sm text-gray-600 mb-4">
              <Sparkles className="w-4 h-4 text-[#c08457]" />
              Expand Your Wardrobe
            </div>
            <h1 className="text-3xl font-serif font-medium text-gray-900">
              Add New Garment
            </h1>
            <p className="text-gray-500 mt-2">
              Upload an image and fill in the details
            </p>
          </div>

          <Card className="p-8">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Image
                  </label>

                  {!preview ? (
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        dragActive
                          ? "border-[#c08457] bg-[#c08457]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("file-input").click()
                      }
                    >
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFile(e.target.files[0])}
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-sm text-gray-400">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={clearFile}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="e.g. Black Hoodie"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          category === cat.value
                            ? "bg-[#c08457] text-white"
                            : "bg-white/50 text-gray-600 hover:bg-white border border-gray-100"
                        }`}
                      >
                        <ImageIcon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Price (optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Brand (optional)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="e.g. Nike"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                {/* Season */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Season (optional)
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 bg-white"
                  >
                    <option value="">Select Season</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                    <option value="All Season">All Season</option>
                  </select>
                </div>

                {/* Message */}
                {message && (
                  <div className={`message-${messageType}`}>
                    {message}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Garment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-6 p-6">
            <CardContent className="p-0">
              <h3 className="font-medium text-gray-900 mb-3">
                Tips for Best Results
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c08457] mt-2" />
                  Use a plain background for cleaner outfit matching
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c08457] mt-2" />
                  Include the full garment in the photo
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c08457] mt-2" />
                  Good lighting helps with color detection
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}