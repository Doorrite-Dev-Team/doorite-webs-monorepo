import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, API_CONFIG } from "@/configs/api"; // Your constant file

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { skipAuth, headers, ...rest } = options;

  // 1. Get Token (Server Side)
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME.ACCESS)?.value;

  // 2. Build Headers
  const reqHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  try {
    const res = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...rest,
      headers: reqHeaders,
    });

    // 3. Handle 401 Redirect (Native Next.js Way)
    if (res.status === 401) {
      redirect("/log-in"); // Throws a NEXT_REDIRECT error, do not catch this!
    }

    const data = await res.json();

    // 4. Handle API Errors (Mirroring Axios)
    if (!res.ok) {
      throw {
        status: res.status,
        message: data.message || "Server Error",
        details: data,
      };
    }

    // 5. Unwrap Response (Mirroring Axios)
    return data?.data ? data : data;
  } catch (error) {
    // specific check to let Next.js redirects pass through
    if ((error as Error).message === "NEXT_REDIRECT") throw error;

    console.error(`[ServerFetch] Error at ${endpoint}:`, error);
    throw error; // Re-throw for the Server Component Error Boundary
  }
}
