import { createServerFn } from "@tanstack/react-start";
import { prisma } from "../db";
import { hashPassword, verifyPassword } from "./hash";
import { setSession, session, clearSession } from "./session";

const courses = [
  "Основы алгоритмизации и программирования",
  "Основы веб-дизайна",
  "Основы проектирования баз данных",
];
export const register = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { login, password, fullname, phone, email } = data;
    if (
      !/^[A-Za-z0-9]{6,}$/.test(login) ||
      password.length < 8 ||
      !/^[А-Яа-яЁё ]+$/.test(fullname) ||
      !/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )
      throw new Error("Проверьте правильность заполнения полей");
    if (await prisma.user.findUnique({ where: { login } }))
      throw new Error("Такой логин уже существует");
    const u = await prisma.user.create({
      data: { login, password: hashPassword(password), fullname, phone, email },
    });
    setSession(u.id, u.role);
    return { ok: true };
  });
export const login = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const u = await prisma.user.findUnique({ where: { login: data.login } });
    if (!u || !verifyPassword(data.password, u.password))
      throw new Error("Неверный логин или пароль");
    setSession(u.id, u.role);
    return { ok: true, role: u.role };
  });
export const logout = createServerFn({ method: "POST" }).handler(async () => {
  clearSession();
  return { ok: true };
});
export const me = createServerFn().handler(async () => {
  const s = session();
  if (!s) return null;
  return prisma.user.findUnique({
    where: { id: s.id },
    select: { id: true, login: true, fullname: true, role: true },
  });
});
export const myEntries = createServerFn().handler(async () => {
  const s = session();
  if (!s) throw new Error("Необходимо войти");
  return prisma.entry.findMany({
    where: { userId: s.id },
    include: { review: true },
    orderBy: { createdAt: "desc" },
  });
});
export const createEntry = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const s = session();
    if (!s) throw new Error("Необходимо войти");
    if (
      !courses.includes(data.course) ||
      !["Наличными", "Переводом по номеру телефона"].includes(data.payment)
    )
      throw new Error("Некорректные данные");
    const dt = new Date(data.startDate);
    if (Number.isNaN(dt.getTime())) throw new Error("Некорректная дата");
    return prisma.entry.create({
      data: {
        course: data.course,
        startDate: dt,
        payment: data.payment,
        userId: s.id,
      },
    });
  });
export const addReview = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const s = session();
    if (!s) throw new Error("Необходимо войти");
    const e = await prisma.entry.findFirst({
      where: {
        id: Number(data.entryId),
        userId: s.id,
        status: "Обучение завершено",
      },
    });
    if (!e) throw new Error("Отзыв доступен после завершения обучения");
    return prisma.review.create({
      data: {
        text: data.text,
        rating: Number(data.rating),
        userId: s.id,
        entryId: e.id,
      },
    });
  });
export const adminEntries = createServerFn().handler(async () => {
  const s = session();
  if (!s || s.role !== "ADMIN") throw new Error("Доступ запрещен");
  return prisma.entry.findMany({
    include: { user: true, review: true },
    orderBy: { createdAt: "desc" },
  });
});
export const updateStatus = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const s = session();
    if (!s || s.role !== "ADMIN") throw new Error("Доступ запрещен");
    if (!["Новая", "Идет обучение", "Обучение завершено"].includes(data.status))
      throw new Error("Недопустимый статус");
    return prisma.entry.update({
      where: { id: Number(data.id) },
      data: { status: data.status },
    });
  });
