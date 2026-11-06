import {getCookie, setCookie, deleteCookie,} from "@tanstack/react-start/server";
const KEY = "korochki_user";
export function setSession(id: number, role: string) {
  setCookie(KEY, `${id}.${role}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
export function session() {
  const v = getCookie(KEY);
  if (!v) return null;
  const [id, role] = v.split(".");
  return { id: Number(id), role };
}
export function clearSession() {
  deleteCookie(KEY, { path: "/" });
}
