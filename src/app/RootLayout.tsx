import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/Footer";
import { Masthead } from "@/components/layout/Masthead";
import { RouteFocus } from "./RouteFocus";
import s from "./RootLayout.module.css";

export function RootLayout() {
  return (
    <>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <Masthead />
      <main id="main" tabIndex={-1} className={s.main}>
        <Outlet />
      </main>
      <Footer />
      <RouteFocus />
      <ScrollRestoration />
      <Toaster
        position="bottom-center"
        toastOptions={{ unstyled: true, classNames: { toast: s.toast, actionButton: s.toastAction } }}
      />
    </>
  );
}
