import {HeadContent, Scripts, createRootRoute, Outlet, Link,} from "@tanstack/react-router";
import appCss from "../styles.css?url";
export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "Корочки.есть — обучение онлайн" },
        ],
        links: [{ rel: "stylesheet", href: appCss }],
    }),
    component: Root,
});
function Root() {
    return (
        <html lang="ru">
            <head>
                <HeadContent />
            </head>
            <body>
                <header className="top">
                    <Link to="/" className="brand">
                        Корочки<span>.есть</span>
                    </Link>
                    <nav>
                        <Link to="/entries">Мои заявки</Link>
                        <Link to="/new">Записаться</Link>
                        <Link to="/admin">Администратор</Link>
                        <Link to="/login">Войти</Link>
                    </nav>
                </header>
                <Outlet />
                <footer>
                    © Корочки.есть · Дополнительное профессиональное образование
                </footer>
                <Scripts />
            </body>
        </html>
    );
}
