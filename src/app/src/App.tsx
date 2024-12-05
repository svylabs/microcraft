import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Converter from "./components/Converter";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import ConfigureVisibilitySelector from "./components/converters/dynamic/ConfigureVisibilitySelector";
import ConfigureInputsOutputs from "./components/converters/dynamic/ConfigureInputsOutputs";
import UserActionPage from "./components/converters/dynamic/UserActionPage";
import ExternalAppPage from "./components/converters/dynamic/ExternalAppPage";
import Action from "./components/converters/dynamic/ActionPage";
import ConfigureThumbnail from "./components/converters/dynamic/ConfigureThumbnail";
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
          <Route path="/" element={<Home />} />
          <Route path="/app/inbuilt/:id" element={<Converter />} />
          <Route path="/app/configure/contracts" element={<ConfigureVisibilitySelector />} />
          <Route path="/app/configure/layout" element={<ConfigureInputsOutputs />} />
          <Route path="/app/preview" element={<Action />} />
          <Route path="/app/configure/thumbnail" element={<ConfigureThumbnail />} />
          <Route path="/app/published/:appId" element={<UserActionPage />} />
          <Route path="/app/view/:appId/:title" element={<UserActionPage />} />
          <Route path="/app/external" element={<ExternalAppPage />} />
        </Routes>
        <ToastContainer /> 
    </>
  );
};

export default App;
