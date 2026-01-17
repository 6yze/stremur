"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@/contexts/UserContext";

const PROFILE_COLORS = [
  "#e50914", // Netflix red
  "#1db954", // Spotify green
  "#ff6b35", // Orange
  "#00a8e1", // Blue
  "#9b59b6", // Purple
  "#f1c40f", // Yellow
  "#e91e63", // Pink
  "#00bcd4", // Cyan
];

export default function SetupPage() {
  const router = useRouter();
  const { setCurrentUser } = useUser();
  const createUser = useMutation(api.users.createUser);
  
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [usePin, setUsePin] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PROFILE_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }
    
    if (usePin && pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const userId = await createUser({
        name: name.trim(),
        pin: usePin ? pin : undefined,
        isAdmin: true,
        color: selectedColor,
      });
      
      // Set as current user and redirect
      setCurrentUser({
        _id: userId,
        name: name.trim(),
        pin: usePin ? pin : undefined,
        isAdmin: true,
        color: selectedColor,
        createdAt: Date.now(),
      });
      
      router.push("/");
    } catch (err) {
      setError("Failed to create profile. Please try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <h1 className="text-4xl font-bold text-red-600 text-center mb-2">STREMUR</h1>
        <p className="text-gray-400 text-center mb-8">Create your admin profile to get started</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Profile Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              maxLength={20}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Color
            </label>
            <div className="flex flex-wrap gap-3">
              {PROFILE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    selectedColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* PIN toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={usePin}
                onChange={(e) => setUsePin(e.target.checked)}
                className="w-5 h-5 rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-red-600"
              />
              <span className="text-gray-300">Protect with PIN</span>
            </label>
          </div>

          {/* PIN input */}
          {usePin && (
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-300 mb-2">
                4-Digit PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setPin(value);
                }}
                placeholder="****"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-center text-2xl tracking-widest"
                maxLength={4}
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors"
          >
            {isCreating ? "Creating..." : "Create Profile"}
          </button>
        </form>

        {/* Preview */}
        <div className="mt-8 flex justify-center">
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-lg mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-lg"
              style={{ backgroundColor: selectedColor }}
            >
              {name ? name.charAt(0).toUpperCase() : "?"}
            </div>
            <p className="text-gray-400 mt-2">{name || "Your Profile"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
