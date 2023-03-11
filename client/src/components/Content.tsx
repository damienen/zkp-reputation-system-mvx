import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Space from "../pages/Space";
import { PageNotFound } from "../pages/PageNotFound";

export const Content = () => {
  return (
    <div className="flex justify-center grow">
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
