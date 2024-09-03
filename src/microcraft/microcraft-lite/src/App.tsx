import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import ConfigureVisibilitySelector from "./components/converters/dynamic/ConfigureVisibilitySelector";
import ConfigureInputsOutputs from "./components/converters/dynamic/ConfigureInputsOutputs";
import ExternalAppPage from "./components/converters/dynamic/ExternalAppPage";
import Action from "./components/converters/dynamic/ActionPage";
import SharePage from "./components/share/SharePage";

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};


const AppContent: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div className="bg-white sticky top-0 z-50">
        {/* <div className="bg-white sticky top-0 z-50"> */}
        <div className="max-w-screen-xl mx-auto pt-3 px-3 md:px-4 lg:px-8 xl:px-8 z-40">
          <Header />
        </div>
        {/* </div> */}
        {!isHomePage && <SharePage />}
      </div>
        <Routes>
          <Route path="/" element={<ExternalAppPage />} />
          <Route path="/app/new/contract" element={<ConfigureVisibilitySelector />} />
          <Route path="/app/new/field" element={<ConfigureInputsOutputs />} />
          <Route path="/app/new/preview" element={<Action />} />
          <Route path="/app/external" element={<ExternalAppPage />} />
        </Routes>
        <ToastContainer /> 
    </>
  );
};

export default App;
