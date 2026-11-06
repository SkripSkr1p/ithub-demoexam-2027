import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
export const Route = createFileRoute("/")({ component: Home });
const imgs = [
  "/src/assets/slider/image06.jpg",
  "/src/assets/slider/image07.jpg",
  "/src/assets/slider/image08.webp",
  "/src/assets/slider/image09.webp",
];
function Home() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v + 1) % imgs.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">ОНЛАЙН-ОБУЧЕНИЕ</p>
          <h1>
            Новые знания.
            <br />
            <em>Новые возможности.</em>
          </h1>
          <p>
            Освойте востребованные навыки и получите профессиональное развитие
            вместе с нами.
          </p>
          <Link className="btn" to="/new">
            Выбрать курс →
          </Link>
        </div>
        <div className="slider">
          <img src={imgs[n]} alt="Обучение" />
          <button className="prev" onClick={() => setN((n + 3) % 4)}>
            ‹
          </button>
          <button className="next" onClick={() => setN((n + 1) % 4)}>
            ›
          </button>
          <div className="dots">
            {imgs.map((_, i) => (
              <button
                key={i}
                className={n === i ? "active" : ""}
                onClick={() => setN(i)}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">НАПРАВЛЕНИЯ</p>
        <h2>Выберите свой курс</h2>
        <div className="cards">
          {[
            "Основы алгоритмизации и программирования",
            "Основы веб-дизайна",
            "Основы проектирования баз данных",
          ].map((x, i) => (
            <article className="course" key={x}>
              <span>0{i + 1}</span>
              <h3>{x}</h3>
              <p>Практические знания для уверенного старта и развития.</p>
              <Link to="/new">Подробнее ↗</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="cta">
        <h2>Готовы начать?</h2>
        <p>Оставьте заявку — и мы поможем сделать первый шаг.</p>
        <Link className="btn light" to="/register">
          Зарегистрироваться
        </Link>
      </section>
    </main>
  );
}
