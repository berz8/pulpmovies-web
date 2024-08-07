import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css?url";
import BottomNavigation from "./components/bottomNavigation";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,user-scalable=no,viewport-fit=cover"
        />
        <meta name="theme-color" content="#252D46" />
        <link rel="icon" href="/favicon.ico" type="image/ico" />
        <link rel="apple-touch-icon" sizes="512x512" href="images/512.png" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-title" content="PulpMovies" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background">
        <div className="w-full min-h-full lg:px-40 lg:max-w-[1400px] m-auto lg:pt-[5.2rem]">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
