"use client";

import { ReactNode } from "react";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { UserProvider } from "@/contexts/UserContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ConvexClientProvider>
  );
}
