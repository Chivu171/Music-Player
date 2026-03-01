import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Trending } from "./pages/Trending";
import { Recommended } from "./pages/Recommended";
import { Albums } from "./pages/Albums";
import { Artists } from "./pages/Artists";

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
]);
