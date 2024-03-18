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
          <Route path="/converter/:id" element={<Converter />} />
          <Route path="/converter/configure/configureDetails/configureInputOutput" element={<ConfigureInputsOutputs />} />
          <Route path="/converter/UserActionPage" element={<UserActionPage />} />
        </Routes>
      </Router>      
    </>
  );
};

export default App;
