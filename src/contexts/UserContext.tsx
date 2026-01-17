"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  name: string;
  pin?: string;
  isAdmin: boolean;
  color: string;
  createdAt: number;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[] | undefined;
  isLoading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "stremur_current_user_id";

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const users = useQuery(api.users.listUsers);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUserId && users) {
      const user = users.find((u) => u._id === storedUserId);
      if (user) {
        setCurrentUserState(user as User);
      }
    }
    if (users !== undefined) {
      setIsLoading(false);
    }
  }, [users]);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, user._id);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        isLoading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
