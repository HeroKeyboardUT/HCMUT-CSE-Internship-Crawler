import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CompanyDetail from "./pages/CompanyDetail";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="h-screen" data-theme="dark">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/company/:id" element={<CompanyDetail />} />
      </Routes>
      <Toaster />
    </div>

    // <MainPage />
  );
}

export default App;
