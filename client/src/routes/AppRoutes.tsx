import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Shop from "../pages/shop/Shop";
import ProductDetails from "../pages/product-details/ProductDetails";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import NewArrivals from "../pages/new-arrivals/NewArrivals";
import Sale from "../pages/sale/Sale";
import Categories from "../pages/categories/Categories";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Products from "../pages/admin/products/Products";
import AddProduct from "../pages/admin/products/AddProduct";
import EditProduct from "../pages/admin/products/EditProduct";
const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {" "}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/sale" element={<Sale />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />

        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="categories" element={<h1>Categories</h1>} />

        <Route path="orders" element={<h1>Orders</h1>} />

        <Route path="users" element={<h1>Users</h1>} />
      </Route>
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
