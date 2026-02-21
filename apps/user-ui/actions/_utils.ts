// src/actions/_utils.ts
import axios from "axios";

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.status === 409
      ? "Email already exists"
      : err.response?.data?.message || err.response?.data?.error || err.message;
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  return "Something went wrong";
}
