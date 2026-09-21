import { useState } from "react";
import Header from "./components/layout/header/Header";
import "./styles/App.css";
import Footer from "./components/layout/footer/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AppRoutes searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Footer />
    </>
  );
}

export default App;
