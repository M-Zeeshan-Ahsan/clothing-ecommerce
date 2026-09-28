import type { RouteObject } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "./AdminRoute";

import Dashboard from "../pages/admin/dashboard/Dashboard";

import Products from "../pages/admin/products/Products";
import AddProduct from "../pages/admin/products/AddProduct";
import EditProduct from "../pages/admin/products/EditProduct";

import AdminCategories from "../pages/admin/categories/Categories";
import AddCategory from "../pages/admin/categories/AddCategory";
import EditCategory from "../pages/admin/categories/EditCategory";

import Orders from "../pages/admin/orders/Orders";
import OrderDetails from "../pages/admin/orders/OrderDetails";

import Users from "../pages/admin/users/Users";
import AddUser from "../pages/admin/users/AddUser";
import EditUser from "../pages/admin/users/EditUser";

const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },

          // Products
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "products/add",
            element: <AddProduct />,
          },
          {
            path: "products/edit/:id",
            element: <EditProduct />,
          },

          // Categories
          {
            path: "categories",
            element: <AdminCategories />,
          },
          {
            path: "categories/add",
            element: <AddCategory />,
          },
          {
            path: "categories/edit/:id",
            element: <EditCategory />,
          },

          // Orders
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "orders/:id",
            element: <OrderDetails />,
          },

          // Users
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "users/add",
            element: <AddUser />,
          },
          {
            path: "users/edit/:id",
            element: <EditUser />,
          },

          // Admin 404
          {
            path: "*",
            element: <h1>Admin 404 - Page Not Found</h1>,
          },
        ],
      },
    ],
  },
];

export default AdminRoutes;
