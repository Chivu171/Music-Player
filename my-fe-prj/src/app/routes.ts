import { createBrowserRouter } from "react-router";
import { Layout } from "@/app/components/Layout";
import { Home } from "@/app/pages/Home";
import { Trending } from "@/app/pages/Trending";
import { Recommended } from "@/app/pages/Recommended";
import { Albums } from "@/app/pages/Albums";
import { Artists } from "@/app/pages/Artists";
import { Login } from "@/app/pages/Login";
import { Register } from "@/app/pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "trending", Component: Trending },
      { path: "recommended", Component: Recommended },
      { path: "albums", Component: Albums },
      { path: "artists", Component: Artists },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
]);
