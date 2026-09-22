import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Shop from "../pages/shop/Shop";
import ProductDetails from "../pages/product-details/ProductDetails";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import NewArrivals from "../pages/new-arrivals/NewArrivals";
import Sale from "../pages/sale/Sale";
import Categories from "../pages/categories/Categories";
interface AppRoutesProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const AppRoutes = ({ searchTerm, setSearchTerm }: AppRoutesProps) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
      />

      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/new-arrivals" element={<NewArrivals />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/sale" element={<Sale />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
