import { getQueryClient } from "@/router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Beaker, Home } from "lucide-react";
import { Navbar } from "../components/Navbar";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        name: "theme-color",
        content: "#2e2825",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Brew Buddy",
      },
      {
        name: "mobile-web-app-capable",
        content: "yes",
      },
      {
        title: "Brew Buddy",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
  }),
  shellComponent: RootDocument,
});

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="text-primary">
        <Beaker className="w-20 h-20 mx-auto opacity-30" />
      </div>
      <div>
        <h1 className="text-6xl font-bold text-base-content mb-2">404</h1>
        <p className="text-xl text-base-content/60">This brew went missing</p>
      </div>
      <Link to="/" className="btn btn-primary">
        <Home className="w-4 h-4 mr-1" />
        Go Home
      </Link>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Limelight&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap"
            rel="stylesheet"
          />
          <HeadContent />
        </head>
        <body
          className="min-h-screen flex flex-col bg-base-200 print:bg-white print:text-black"
          style={{ padding: "env(safe-area-inset-bottom)" }}
        >
          <Navbar />
          <main className="flex-1 mx-auto px-2 sm:px-6 lg:px-8 py-8 w-full lg:w-6xl print:p-0">
            {children}
          </main>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
          <script
            dangerouslySetInnerHTML={{
              __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js'); }); }`,
            }}
          />
        </body>
      </html>
    </QueryClientProvider>
  );
}
