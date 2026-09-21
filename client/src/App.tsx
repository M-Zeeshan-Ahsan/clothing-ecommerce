import { useState } from "react";
import Header from "./components/layout/header/Header";
import Home from "./pages/Home/Home";
import "./styles/App.css";
import Footer from "./components/layout/footer/Footer";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Footer />
    </>
  );
}

export default App;
