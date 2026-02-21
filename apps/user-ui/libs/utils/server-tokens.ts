import "server-only";
import { cookies } from "next/headers";

const ACCESS = "access_token_user";
const REFRESH = "refresh_token_user";

type TokensType = { access: string | null; refresh: string | null };
export const serverToken = async (): Promise<TokensType> => {
  const Cookies = await cookies();

  const access = Cookies.get(ACCESS)?.value ?? null;
  const refresh = Cookies.get(REFRESH)?.value ?? null;

  return { access, refresh };
};
