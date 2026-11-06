import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { myEntries, addReview, logout } from "#/lib/actions";
export const Route = createFileRoute("/entries")({
  loader: () => myEntries(),
  component: Entries,
});
function Entries() {
  const list = Route.useLoaderData();
  const nav = useNavigate();
  const [err, setE] = useState(""),
    [msg, setM] = useState("");
  async function review(e: any, id: number) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await addReview({
        data: {
          entryId: id,
          text: String(fd.get("text")),
          rating: Number(fd.get("rating")),
        },
      });
      setM("Отзыв сохранен");
      nav({ to: "/entries", reloadDocument: true });
    } catch (x: any) {
      setE(x.message);
    }
  }
  return (
    <main className="section">
      <div className="headingrow">
        <div>
          <p className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</p>
          <h1>Мои заявки</h1>
        </div>
        <Link className="btn" to="/new">
          + Новая заявка
        </Link>
      </div>
      {err && <div className="alert">{err}</div>}
      {msg && <p>{msg}</p>}
      {list.length === 0 ? (
        <div className="empty">
          Заявок пока нет. <Link to="/new">Записаться на курс</Link>
        </div>
      ) : (
        <div className="entrylist">
          {list.map((e: any) => (
            <article className="entry" key={e.id}>
              <div className="entrytop">
                <span className="status">{e.status}</span>
                <small>Заявка №{e.id}</small>
              </div>
              <h3>{e.course}</h3>
              <p>
                Начало: {new Date(e.startDate).toLocaleDateString("ru-RU")} ·
                Оплата: {e.payment}
              </p>
              {e.review ? (
                <div className="review">
                  Ваш отзыв: {e.review.text} · ★ {e.review.rating}
                </div>
              ) : e.status === "Обучение завершено" ? (
                <form
                  className="reviewform"
                  onSubmit={(ev) => review(ev, e.id)}
                >
                  <label>
                    Ваш отзыв
                    <textarea name="text" required minLength={3} />
                  </label>
                  <label>
                    Оценка
                    <select name="rating">
                      <option value="5">5 — отлично</option>
                      <option value="4">4 — хорошо</option>
                      <option value="3">3 — удовлетворительно</option>
                      <option value="2">2 — плохо</option>
                      <option value="1">1 — очень плохо</option>
                    </select>
                  </label>
                  <button className="btn">Оставить отзыв</button>
                </form>
              ) : (
                <small className="muted">
                  Отзыв можно оставить после завершения курса.
                </small>
              )}
            </article>
          ))}
        </div>
      )}
      <button
        className="textbtn"
        onClick={async () => {
          await logout();
          nav({ to: "/" });
        }}
      >
        Выйти из аккаунта
      </button>
    </main>
  );
}
