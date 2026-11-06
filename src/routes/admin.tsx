import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { adminEntries, updateStatus, logout } from "#/lib/actions";
export const Route = createFileRoute("/admin")({
  loader: () => adminEntries(),
  component: Admin,
});
function Admin() {
  const data = Route.useLoaderData();
  const nav = useNavigate();
  const [filter, setF] = useState("Все"),
    [q, setQ] = useState(""),
    [notice, setN] = useState("");
  const rows = data.filter(
    (x: any) =>
      (filter === "Все" || x.status === filter) &&
      `${x.user.fullname} ${x.course} ${x.user.login}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  async function change(id: number, status: string) {
    try {
      await updateStatus({ data: { id, status } });
      setN("Статус заявки обновлен");
      nav({ to: "/admin", reloadDocument: true });
    } catch (e: any) {
      setN(e.message);
    }
  }
  return (
    <main className="section">
      <p className="eyebrow">УПРАВЛЕНИЕ</p>
      <h1>Панель администратора</h1>
      <p className="muted">Заявки пользователей и контроль обучения</p>
      {notice && <div className="success">{notice}</div>}
      <div className="toolbar">
        <input
          placeholder="Поиск по пользователю или курсу"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={filter} onChange={(e) => setF(e.target.value)}>
          <option>Все</option>
          <option>Новая</option>
          <option>Идет обучение</option>
          <option>Обучение завершено</option>
        </select>
      </div>
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Ученик</th>
              <th>Курс</th>
              <th>Дата</th>
              <th>Оплата</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e: any) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>
                  {e.user.fullname}
                  <small>{e.user.email}</small>
                </td>
                <td>{e.course}</td>
                <td>{new Date(e.startDate).toLocaleDateString("ru-RU")}</td>
                <td>{e.payment}</td>
                <td>
                  <span className="status">{e.status}</span>
                </td>
                <td>
                  <select
                    value={e.status}
                    onChange={(ev) => change(e.id, ev.target.value)}
                  >
                    <option>Новая</option>
                    <option>Идет обучение</option>
                    <option>Обучение завершено</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="empty">Заявки не найдены</p>}
      </div>
      <button
        className="textbtn"
        onClick={async () => {
          await logout();
          nav({ to: "/" });
        }}
      >
        Выйти
      </button>
    </main>
  );
}
