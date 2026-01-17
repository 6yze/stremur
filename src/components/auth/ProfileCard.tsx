"use client";

import { User } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  user: User;
  onClick: () => void;
  isSelected?: boolean;
  showEdit?: boolean;
  onEdit?: () => void;
}

export function ProfileCard({ user, onClick, isSelected, showEdit, onEdit }: ProfileCardProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          "flex flex-col items-center gap-3 p-4 rounded-lg transition-all duration-200",
          "hover:bg-white/10",
          isSelected && "ring-2 ring-white"
        )}
      >
        {/* Avatar */}
        <div
          className="w-24 h-24 md:w-32 md:h-32 rounded-lg flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-lg"
          style={{ backgroundColor: user.color }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        {/* Name */}
        <span className="text-gray-300 text-lg group-hover:text-white transition-colors">
          {user.name}
        </span>
        
        {/* PIN indicator */}
        {user.pin && (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>PIN</span>
          </div>
        )}
      </button>
      
      {/* Edit button */}
      {showEdit && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
    </div>
  );
}
