import { useState } from "react";
import Header from "./components/layout/Header";
import Home from "./pages/Home/Home";
import "./styles/App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </>
  );
}

export default App;
