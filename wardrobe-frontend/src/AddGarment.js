import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function AddGarment({ refreshClothes }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState(""); // ✅ already had this

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      setMessage("❌ You must login first.");
      return;
    }

    if (!file || !name || !category) {
      setMessage("❌ Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("user_id", user_id);
    formData.append("file", file);

    // 🔥 NEW: SEND PRICE
    formData.append("price", price || 0);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-garment", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.detail?.[0]?.msg || "❌ Upload failed.");
        return;
      }

      // 🔥 NEW: DUPLICATE MESSAGE HANDLING
      if (data.duplicate) {
        setMessage(`⚠️ ${data.duplicate}`);
      } else {
        setMessage("✅ Garment uploaded successfully!");
      }

      setName("");
      setCategory("");
      setFile(null);
      setPrice(""); // 🔥 reset price too

      if (refreshClothes) refreshClothes();
    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Add Garment</h2>

      <Card className="shadow-md">
        <CardContent className="p-6 space-y-5">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Garment Name</label>
              <Input
                placeholder="e.g. Black Hoodie"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* CATEGORY */}
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Category</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
                <option value="Shoes">Shoes</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* 🔥 NEW: PRICE INPUT */}
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Price ($)</label>
              <Input
                type="number"
                placeholder="e.g. 50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* FILE */}
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-sm"
              />

              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-md mt-2"
                />
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full !bg-blue-500 hover:!bg-blue-600 text-white"
            >
              Upload Garment
            </Button>

          </form>

          {/* MESSAGE */}
          {message && (
            <p className="text-sm text-center text-gray-600">
              {message}
            </p>
          )}

        </CardContent>
      </Card>
    </div>
  );
}