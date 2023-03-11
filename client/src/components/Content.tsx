import { Box } from "@chakra-ui/react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import { PageNotFound } from "../pages/PageNotFound";
import Space from "../pages/Space";

export const Content = () => {
  return (
    <div className="flex justify-center grow bg-slate-100 shadow-lg">
      <Box className="w-10/12 bg-slate-100 shadow-lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/space" element={<Space />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>
    </div>
  );
};

export default Content;
