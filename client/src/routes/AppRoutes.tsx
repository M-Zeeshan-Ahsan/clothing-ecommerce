import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Shop from "../pages/shop/Shop";
import ProductDetails from "../pages/product-details/ProductDetails";

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
      <Route path="/categories" element={<h1>Categories Page</h1>} />

      <Route path="/new-arrivals" element={<h1>New Arrivals Page</h1>} />

      <Route path="/sale" element={<h1>Sale Page</h1>} />

      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
