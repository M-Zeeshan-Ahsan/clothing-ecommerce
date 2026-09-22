import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

import "./MainLayout.scss";

const MainLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="main-layout">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="main-layout__content">
        <Outlet
          context={{
            searchTerm,
            setSearchTerm,
          }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
