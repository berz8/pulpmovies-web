import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import BottomNavigation from "./components/bottomNavigation";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#252D46" />
        <link rel="icon" href="/favicon.ico" type="image/ico" />
        <link rel="apple-touch-icon" sizes="512x512" href="images/512.png" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-title" content="PulpMovies" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background w-full min-h-full">
        <div className="w-full min-h-full lg:px-40 lg:max-w-[1400px] m-auto">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
