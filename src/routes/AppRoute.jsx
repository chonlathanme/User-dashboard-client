import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "../components/Home/Home";
import GoogleLogin from "../components/Auth/GoogleLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <GoogleLogin />,
  },
])

const AppRoute = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default AppRoute