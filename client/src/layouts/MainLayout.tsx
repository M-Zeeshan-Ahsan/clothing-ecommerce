import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import WhatsAppButton from "../components/layout/whatsAppButton/WhatsAppButton";

import "./MainLayout.scss";

const MainLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isHomePage = location.pathname === "/";
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

      <Footer className={isHomePage ? "footer__home" : ""} />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
