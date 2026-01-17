"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser, User } from "@/contexts/UserContext";
import { ProfileCard } from "@/components/auth/ProfileCard";

const PROFILE_COLORS = [
  "#e50914", "#1db954", "#ff6b35", "#00a8e1",
  "#9b59b6", "#f1c40f", "#e91e63", "#00bcd4",
];

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, users, isLoading, logout } = useUser();
  const createUser = useMutation(api.users.createUser);
  const deleteUser = useMutation(api.users.deleteUser);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [usePin, setUsePin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PROFILE_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!currentUser || !currentUser.isAdmin)) {
      router.push("/profiles");
    }
  }, [currentUser, isLoading, router]);

  const handleCreateUser = async (e: React.FormEvent) => {
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
      await createUser({
        name: name.trim(),
        pin: usePin ? pin : undefined,
        isAdmin,
        color: selectedColor,
      });
      
      // Reset form
      setName("");
      setPin("");
      setUsePin(false);
      setIsAdmin(false);
      setSelectedColor(PROFILE_COLORS[0]);
      setShowCreateForm(false);
    } catch (err) {
      setError("Failed to create profile. Please try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Don't allow deleting yourself
      if (userId === currentUser?._id) {
        setError("You cannot delete your own profile");
        return;
      }
      
      await deleteUser({ userId: userId as any });
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete profile");
      console.error(err);
    }
  };

  if (isLoading || !currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Profiles</h1>
            <p className="text-gray-400 mt-1">Add, edit, or remove user profiles</p>
          </div>
          <button
            onClick={() => router.push("/profiles")}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Done
          </button>
        </div>

        {/* Current profiles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Profiles ({users?.length || 0})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {users?.map((user) => (
              <div key={user._id} className="relative group">
                <ProfileCard
                  user={user as User}
                  onClick={() => {}}
                  showEdit={false}
                />
                {/* Delete button */}
                {user._id !== currentUser._id && (
                  <button
                    onClick={() => setDeleteConfirm(user._id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                {/* Admin badge */}
                {user.isAdmin && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-600 text-xs font-semibold rounded">
                    Admin
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add new profile section */}
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-white transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Profile
          </button>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Profile</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
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
                  placeholder="Enter name"
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
                      className={`w-8 h-8 rounded-full transition-transform ${
                        selectedColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Options row */}
              <div className="flex flex-wrap gap-6">
                {/* PIN toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePin}
                    onChange={(e) => setUsePin(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-gray-300 text-sm">Protect with PIN</span>
                </label>

                {/* Admin toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-gray-300 text-sm">Admin privileges</span>
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
                    className="w-32 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors text-center text-xl tracking-widest"
                    maxLength={4}
                  />
                </div>
              )}

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded font-semibold text-white transition-colors"
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError("");
                  }}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-lg max-w-sm w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-2">Delete Profile?</h3>
              <p className="text-gray-400 mb-6">
                This will permanently delete this profile and all associated watch history.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold text-white transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 rounded font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
