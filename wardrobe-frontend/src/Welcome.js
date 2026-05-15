import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Sparkles, Shirt, BarChart3, Calendar, ArrowRight } from "lucide-react";

function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shirt,
      title: "Digital Closet",
      description: "Organize your entire wardrobe in one place"
    },
    {
      icon: Sparkles,
      title: "AI Outfits",
      description: "Get personalized outfit recommendations"
    },
    {
      icon: BarChart3,
      title: "Style Analytics",
      description: "Track your fashion habits and spending"
    },
    {
      icon: Calendar,
      title: "Plan Ahead",
      description: "Schedule outfits for upcoming events"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c08457] to-[#a56a45] flex items-center justify-center">
            <Shirt className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">Wardrobe</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/signup")}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 text-sm text-gray-600 mb-6">
            <Sparkles className="w-4 h-4 text-[#c08457]" />
            Your personal AI stylist
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-gray-900 mb-6">
            Your Closet,{" "}
            <span className="text-gradient">Reimagined</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform how you dress with AI-powered outfit recommendations, 
            smart organization, and style insights tailored just for you.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 text-center fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c08457]/10 to-[#c08457]/5 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-[#c08457]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 mt-20 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">10k+</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <div className="text-3xl font-bold text-gray-900">500k+</div>
            <div className="text-sm text-gray-500">Outfits Created</div>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div>
            <div className="text-3xl font-bold text-gray-900">4.9</div>
            <div className="text-sm text-gray-500">App Rating</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/50 py-8 mt-12">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          2024 Wardrobe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Welcome;