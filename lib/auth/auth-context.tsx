"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER: UserProfile = {
  id: "guest-user",
  email: "guest@pdfforge.local",
  fullName: "Guest User",
  plan: "free",
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check saved session in localStorage
    const saved = localStorage.getItem("pdfforge_user_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsGuest(parsed.id === "guest-user");
      } catch {
        // Clear invalid
      }
    } else {
      // Default to guest mode so users don't have barriers to entry
      setUser(GUEST_USER);
      setIsGuest(true);
    }
    setIsLoading(false);
  }, []);

  const loginWithEmail = async (email: string, _pass: string) => {
    setIsLoading(true);
    // Simulate / real auth flow
    await new Promise((r) => setTimeout(r, 400));
    const newUser: UserProfile = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      email,
      fullName: email.split("@")[0].replace(/[._]/g, " "),
      plan: "free",
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsGuest(false);
    localStorage.setItem("pdfforge_user_session", JSON.stringify(newUser));
    setIsLoading(false);
    return {};
  };

  const registerWithEmail = async (email: string, _pass: string, name?: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const newUser: UserProfile = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      email,
      fullName: name || email.split("@")[0],
      plan: "free",
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsGuest(false);
    localStorage.setItem("pdfforge_user_session", JSON.stringify(newUser));
    setIsLoading(false);
    return {};
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const newUser: UserProfile = {
      id: "google_" + Math.random().toString(36).substring(2, 9),
      email: "alex.smith@gmail.com",
      fullName: "Alex Smith",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      plan: "free",
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsGuest(false);
    localStorage.setItem("pdfforge_user_session", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(GUEST_USER);
    setIsGuest(true);
    localStorage.removeItem("pdfforge_user_session");
  };

  const continueAsGuest = () => {
    setUser(GUEST_USER);
    setIsGuest(true);
    localStorage.setItem("pdfforge_user_session", JSON.stringify(GUEST_USER));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        continueAsGuest,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
