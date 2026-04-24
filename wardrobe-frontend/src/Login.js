import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Mail, Lock, Loader2 } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError(false);

    if (!email || !password) {
      setMessage("Please fill all fields");
      setError(true);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage(data.error || "Invalid credentials");
        setError(true);
        return;
      }

      localStorage.setItem("user_id", data.user_id);
      navigate("/dashboard");

    } catch {
      setMessage("Server error");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <Card className="w-[360px] shadow-lg hover:shadow-xl transition">
        <CardContent className="p-6 space-y-4">

          <h2 className="text-xl font-semibold text-center">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-3">

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-9 ${error ? "border-red-500" : ""}`}
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-9 ${error ? "border-red-500" : ""}`}
              />
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Login"
              )}
            </Button>

          </form>

          {message && (
            <p className="text-sm text-center text-red-500">
              {message}
            </p>
          )}

        </CardContent>
      </Card>

    </div>
  );
}

export default Login;