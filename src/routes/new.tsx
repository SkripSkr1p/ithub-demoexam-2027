import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createEntry } from "#/lib/actions";
export const Route = createFileRoute("/new")({ component: NewEntry });
function NewEntry() {
  const nav = useNavigate();
  const [course, setC] = useState("Основы алгоритмизации и программирования"),
    [date, setD] = useState(""),
    [payment, setP] = useState("Наличными"),
    [err, setE] = useState("");
  async function submit(e: any) {
    e.preventDefault();
    try {
      await createEntry({ data: { course, startDate: date, payment } });
      nav({ to: "/entries" });
    } catch (x: any) {
      setE(x.message || "Не удалось отправить");
    }
  }
  return (
    <main className="formpage">
      <div className="formbox wide">
        <p className="eyebrow">ЗАЯВКА НА ОБУЧЕНИЕ</p>
        <h1>Выберите курс</h1>
        <p className="muted">
          Заполните данные — заявка поступит администратору
        </p>
        <form onSubmit={submit}>
          <label>
            Курс
            <select value={course} onChange={(e) => setC(e.target.value)}>
              <option>Основы алгоритмизации и программирования</option>
              <option>Основы веб-дизайна</option>
              <option>Основы проектирования баз данных</option>
            </select>
          </label>
          <label>
            Желаемая дата начала
            <input
              type="date"
              value={date}
              onChange={(e) => setD(e.target.value)}
              required
            />
          </label>
          <label>
            Способ оплаты
            <select value={payment} onChange={(e) => setP(e.target.value)}>
              <option>Наличными</option>
              <option>Переводом по номеру телефона</option>
            </select>
          </label>
          {err && <div className="alert">{err}</div>}
          <button className="btn full">Отправить заявку</button>
        </form>
        <p className="bottomlink">
          <Link to="/entries">← Мои заявки</Link>
        </p>
      </div>
    </main>
  );
}
