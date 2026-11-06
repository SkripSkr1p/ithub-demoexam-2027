import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { register } from "#/lib/actions";
export const Route = createFileRoute("/register")({ component: Register });
function Register() {
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [v, setV] = useState({
    login: "",
    password: "",
    fullname: "",
    phone: "",
    email: "",
  });
  const upd = (k: string, x: string) => setV({ ...v, [k]: x });
  async function submit(e: any) {
    e.preventDefault();
    setErr("");
    try {
      await register({ data: v });
      nav({ to: "/entries" });
    } catch (x: any) {
      setErr(x.message || "Ошибка регистрации");
    }
  }
  return (
    <main className="formpage">
      <div className="formbox">
        <p className="eyebrow">СОЗДАЙТЕ АККАУНТ</p>
        <h1>Регистрация</h1>
        <p className="muted">Начните путь к новым знаниям</p>
        <form onSubmit={submit}>
          <label>
            Логин
            <input
              value={v.login}
              onChange={(e) => upd("login", e.target.value)}
              minLength={6}
              pattern="[A-Za-z0-9]+"
              required
              placeholder="латиница и цифры"
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={v.password}
              onChange={(e) => upd("password", e.target.value)}
              minLength={8}
              required
            />
          </label>
          <label>
            ФИО
            <input
              value={v.fullname}
              onChange={(e) => upd("fullname", e.target.value)}
              pattern="[А-Яа-яЁё ]+"
              required
              placeholder="Иванов Иван Иванович"
            />
          </label>
          <label>
            Телефон
            <input
              value={v.phone}
              onChange={(e) => upd("phone", e.target.value)}
              pattern="8\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}"
              required
              placeholder="8(999)123-45-67"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={v.email}
              onChange={(e) => upd("email", e.target.value)}
              required
            />
          </label>
          {err && <div className="alert">{err}</div>}
          <button className="btn full">Зарегистрироваться</button>
        </form>
        <p className="bottomlink">
          Уже зарегистрированы? <Link to="/login">Войти</Link>
        </p>
      </div>
    </main>
  );
}
