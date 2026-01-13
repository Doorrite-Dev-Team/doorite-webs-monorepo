import { isAxiosError } from "axios";

export const deriveError = (err: unknown) => {
  let error;
  if (isAxiosError(err)) {
    error =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message;
  } else if (err instanceof Error) {
    error = err?.message;
  } else {
    error = err;
  }
  return error as string;
};
