import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Converter from "./components/Converter";
import "./App.css";
import ConfigureInputsOutputs from "./components/converters/dynamic/ConfigureInputsOutputs";
import UserActionPage from "./components/converters/dynamic/UserActionPage";

const App: React.FC = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app/inbuilt/:id" element={<Converter />} />
          <Route path="/app/new" element={<ConfigureInputsOutputs />} />
          <Route path="/app/published/:appId" element={<UserActionPage />} />
        </Routes>
      </Router>      
    </>
  );
};

export default App;
