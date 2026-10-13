import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Footer, Header, LangProvider, pageFromPath, DESCRIPTION } from "../lib/site";

function NotFoundComponent() {
  return (
    <section className="section narrow">
      <h1>404</h1>
      <p>
        <Link className="btn btn-primary" to="/">
          ←
        </Link>
      </p>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <section className="section narrow">
      <h1>Ошибка</h1>
      <button
        className="btn btn-primary"
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Try again
      </button>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "color-scheme", content: "light" },
      { name: "theme-color", content: "#dbee75" },
      { title: "Сдай батарейку — Чертаново" },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body data-page={pageFromPath(pathname)}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useCaptureReferral();
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <Header />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </LangProvider>
    </QueryClientProvider>
  );
}
