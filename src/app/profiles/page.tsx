"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, User } from "@/contexts/UserContext";
import { ProfileCard } from "@/components/auth/ProfileCard";
import { PinModal } from "@/components/auth/PinModal";

export default function ProfilesPage() {
  const router = useRouter();
  const { users, setCurrentUser, isLoading } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  const handleProfileClick = (user: User) => {
    if (user.pin) {
      setSelectedUser(user);
      setShowPinModal(true);
    } else {
      setCurrentUser(user);
      router.push("/");
    }
  };

  const handlePinSuccess = () => {
    if (selectedUser) {
      setCurrentUser(selectedUser);
      setShowPinModal(false);
      router.push("/");
    }
  };

  const handlePinCancel = () => {
    setShowPinModal(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // If no users exist, redirect to setup
  if (users && users.length === 0) {
    router.push("/setup");
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-white mb-2">Who's watching?</h1>
      <p className="text-gray-400 mb-12">Select your profile</p>

      {/* Profile grid */}
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
        {users?.map((user) => (
          <ProfileCard
            key={user._id}
            user={user as User}
            onClick={() => handleProfileClick(user as User)}
          />
        ))}
        
        {/* Add profile button */}
        {users && users.some(u => u.isAdmin) && (
          <button
            onClick={() => router.push("/admin")}
            className="flex flex-col items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-white transition-colors">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-gray-500 text-lg">Add Profile</span>
          </button>
        )}
      </div>

      {/* Manage Profiles link */}
      {users && users.some(u => u.isAdmin) && (
        <button
          onClick={() => router.push("/admin")}
          className="mt-12 px-6 py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded transition-colors"
        >
          Manage Profiles
        </button>
      )}

      {/* PIN Modal */}
      {showPinModal && selectedUser && (
        <PinModal
          user={selectedUser}
          onSuccess={handlePinSuccess}
          onCancel={handlePinCancel}
        />
      )}
    </div>
  );
}
