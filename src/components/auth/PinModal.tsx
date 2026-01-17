"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { User } from "@/contexts/UserContext";

interface PinModalProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PinModal({ user, onSuccess, onCancel }: PinModalProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [submittedPin, setSubmittedPin] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Use query to validate PIN - only runs when submittedPin is set
  const isValid = useQuery(
    api.users.validatePin,
    submittedPin ? { userId: user._id, pin: submittedPin } : "skip"
  );

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  // Handle validation result
  useEffect(() => {
    if (submittedPin !== null && isValid !== undefined) {
      if (isValid) {
        onSuccess();
      } else {
        setError(true);
        setPin(["", "", "", ""]);
        setSubmittedPin(null);
        inputRefs.current[0]?.focus();
      }
    }
  }, [isValid, submittedPin, onSuccess]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Only keep last digit
    setPin(newPin);
    setError(false);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 3) {
      const fullPin = newPin.join("");
      if (fullPin.length === 4) {
        setSubmittedPin(fullPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const isValidating = submittedPin !== null && isValid === undefined;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-8 rounded-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-lg mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white"
            style={{ backgroundColor: user.color }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold text-white">{user.name}</h2>
          <p className="text-gray-400 mt-2">Enter your PIN to continue</p>
        </div>

        {/* PIN Input */}
        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isValidating}
              className={`w-14 h-14 text-center text-2xl font-bold rounded-lg bg-zinc-800 border-2 
                ${error ? "border-red-500" : "border-zinc-700"} 
                focus:border-white focus:outline-none transition-colors
                disabled:opacity-50`}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-center mb-4">
            Incorrect PIN. Please try again.
          </p>
        )}

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="w-full py-3 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
