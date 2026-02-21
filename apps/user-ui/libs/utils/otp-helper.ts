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

export const isOpen = (open: string, close: string): boolean => {
  // Helper to convert "hh:mm" to total minutes since midnight
  const timeToMinutes = (t: string) => {
    // Correctly split "hh:mm" -> hours at index 0, minutes at index 1
    const [h, m] = t.split(":").map(Number);
    return h! * 60 + m!;
  };

  const openMinutes = timeToMinutes(open);
  const closeMinutes = timeToMinutes(close);

  const now = new Date();
  // Get the current time in minutes since midnight
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (openMinutes <= closeMinutes) {
    // Case 1: Standard hours (e.g., 09:00 to 17:00)
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // Case 2: Hours cross midnight (e.g., 22:00 to 02:00)
    // It's open if it's past the open time, OR it's before the close time.
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
};
