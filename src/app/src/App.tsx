import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Converter from "./components/Converter";
import "./App.css";
// import DynamicHome from "./components/converters/dynamic/DynamicHome";
// import ConfigureBasicDetails from "./components/converters/dynamic/ConfigureBasicDetails";

const App: React.FC = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [selectedCodeId, setSelectedCodeId] = useState(null);

  // const handlePreviousPage = () => {
  //   setCurrentPage(currentPage - 1);
  // };

  // const handleNext = () => {
  //   setCurrentPage(currentPage + 1);
  // };

  // const handleBackToFirstPage = () => {
  //   setCurrentPage(1);
  // };

  // const handleImageClick = (id) => {
  //   // console.log(id);
  //   setSelectedCodeId(id);
  //   setCurrentPage(4);
  // };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/converter/:id" element={<Converter />} />
        </Routes>
      </Router>
      {/* {currentPage === 1 && (
        <DynamicHome
          handleNext={handleNext}
          handleImageClick={handleImageClick}
        />
      )} */}

      {/* {currentPage === 2 && <ConfigureBasicDetails />} */}
      
    </>
  );
};

export default App;
