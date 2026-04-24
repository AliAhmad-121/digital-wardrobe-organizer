import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Shirt } from "lucide-react";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="text-center space-y-6 max-w-xl">

        <div className="flex justify-center">
          <Shirt className="w-10 h-10 text-[#c08457]" />
        </div>

        <h1 className="text-4xl font-bold">
          Digital Wardrobe Organizer
        </h1>

        <p className="text-gray-500">
          Organize your wardrobe and get smart outfit recommendations instantly.
        </p>

        <div className="flex justify-center gap-4">

          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            className="bg-[#c08457] hover:bg-[#a56a45] text-white"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>

        </div>

      </div>

    </div>
  );
}

export default Welcome;