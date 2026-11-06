import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "#/lib/actions";
export const Route = createFileRoute("/login")({ component: Login });
function Login() {
  const nav = useNavigate();
  const [loginText, setL] = useState(""),
    [password, setP] = useState(""),
    [err, setE] = useState("");
  async function submit(e: any) {
    e.preventDefault();
    try {
      const r = await login({ data: { login: loginText, password } });
      nav({ to: r.role === "ADMIN" ? "/admin" : "/entries" });
    } catch (x: any) {
      setE(x.message || "Ошибка входа");
    }
  }
  return (
    <main className="formpage">
      <div className="formbox">
        <p className="eyebrow">С ВОЗВРАЩЕНИЕМ</p>
        <h1>Войти</h1>
        <p className="muted">Продолжите обучение</p>
        <form onSubmit={submit}>
          <label>
            Логин
            <input
              value={loginText}
              onChange={(e) => setL(e.target.value)}
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setP(e.target.value)}
              required
            />
          </label>
          {err && <div className="alert">{err}</div>}
          <button className="btn full">Войти</button>
        </form>
        <p className="bottomlink">
          Еще не зарегистрированы? <Link to="/register">Регистрация</Link>
        </p>
      </div>
    </main>
  );
}
