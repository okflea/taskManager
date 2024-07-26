import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Board from "@/components/v2/Board";
import ErrorPage from "@/ErrorPage";
import TopBar from "@/components/TopBar";
import Register from "@/pages/Register";

const Routes = () => {

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
    {
      path: "/login",
      element: <><TopBar /><Login /></>
    },
    {
      path: "/register",
      element: <><TopBar /><Register /></>
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      errorElement: <><TopBar /><ErrorPage /></>,
      children: [
        {
          path: "",
          element: <><TopBar /><Board /></>
        },
        {
          path: "/profile",
          element: <div>User Profile</div>,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  // const routesForNotAuthenticatedOnly = [
  //   {
  //     path: "/login",
  //     element: <><TopBar /><Login /></>
  //   },
  // ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    // ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
