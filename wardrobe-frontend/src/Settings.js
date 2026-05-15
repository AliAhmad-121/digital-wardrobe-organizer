import React from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleExport = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/export-data/${userId}`
      );

      if (!response.ok) {
        alert("Failed to export data.");
        return;
      }

      const data = await response.json();

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      );

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "digital-wardrobe-data.json";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      alert("Export failed.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account and all data."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/delete-account/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("Failed to delete account.");
        return;
      }

      localStorage.removeItem("user_id");
      alert("Account deleted successfully.");
      navigate("/");
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">Settings ⚙️</h2>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Button
            onClick={handleExport}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            📤 Export My Data
          </Button>

          <Button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            🗑️ Delete My Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}