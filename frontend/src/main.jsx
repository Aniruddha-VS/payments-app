import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Signup from "./routes/signup";
import Signin from "./routes/signin";
import Dashbaord from "./routes/dashboard";
import SendMoney from "./routes/sendMoney";
import ErrorPage from "./error-page";
import "./index.css";
import { RecoilRoot } from "recoil";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <Signin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashbaord />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/send",
    element: <SendMoney />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
);
