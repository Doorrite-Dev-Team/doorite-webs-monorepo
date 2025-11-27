// otp-helpers.ts

// --- Configuration Constants ---
export const OTP_LENGTH = 6;
export const INITIAL_COUNTDOWN = 60; // 1 minute
export const MAX_RESEND_ATTEMPTS = 3;
export const LOCKOUT_DURATION = 10 * 60; // 10 minutes in seconds

/**
 * Formats time in seconds into a MM:SS string.
 * @param totalSeconds The total seconds to format.
 * @returns A string in "MM:SS" format.
 */
export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
