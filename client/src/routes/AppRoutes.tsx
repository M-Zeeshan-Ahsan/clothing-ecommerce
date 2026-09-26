import { useRoutes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Shop from "../pages/shop/Shop";
import ProductDetails from "../pages/product-details/ProductDetails";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import NewArrivals from "../pages/new-arrivals/NewArrivals";
import Sale from "../pages/sale/Sale";
import Categories from "../pages/categories/Categories";
import Wishlist from "../pages/wishlist/Wishlist";
import OrderSuccess from "../pages/orders/OrderSuccess";
import Contact from "../pages/contact/Contact";
import Terms from "../pages/terms/Terms";
import Privacy from "../pages/privacy/Privacy";
import Shipping from "../pages/shipping/Shipping";
import ReturnExchange from "../pages/return-exchange/ReturnExchange";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  const routes = useRoutes([
    // Customer Routes
    {
      element: <MainLayout />,
      children: [
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/shop",
          element: <Shop />,
        },
        {
          path: "/product/:id",
          element: <ProductDetails />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/checkout",
          element: <Checkout />,
        },
        {
          path: "/new-arrivals",
          element: <NewArrivals />,
        },
        {
          path: "/categories",
          element: <Categories />,
        },
        {
          path: "/sale",
          element: <Sale />,
        },
        {
          path: "/wishlist",
          element: <Wishlist />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/terms",
          element: <Terms />,
        },
        {
          path: "/privacy-policy",
          element: <Privacy />,
        },
        {
          path: "/shipping",
          element: <Shipping />,
        },
        {
          path: "/returns",
          element: <ReturnExchange />,
        },
        {
          path: "/order-success/:id",
          element: <OrderSuccess />,
        },
      ],
    },

    // Admin Routes
    ...AdminRoutes,

    // Global 404
    {
      path: "*",
      element: <h1>404 - Page Not Found</h1>,
    },
  ]);

  return routes;
};

export default AppRoutes;
