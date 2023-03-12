import { Box } from "@chakra-ui/react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import { PageNotFound } from "../pages/PageNotFound";
import Space from "../pages/Space";
import ReputationGiver from "./ReputationGiver";
import ReputationNamespace from "./ReputationNamespace";
import ReputationRoles from "./ReputationRoles";
import { Claims } from "./Claims";
import CampaignDetail from "./CampaignDetail";

export const Content = () => {
  return (
    <div className="flex justify-center grow shadow-lg">
      <Box className="w-10/12 shadow-lg shadow-itheum-dark">
        <Routes>
          <Route index path="" element={<Home />} />
          <Route path="collector" element={<Claims />} />
          <Route path="reputation" element={<ReputationGiver />} />
          <Route path="reputation/roles" element={<ReputationRoles />} />
          <Route path="reputation/roles/namespace" element={<ReputationNamespace />} />


          <Route path="about" element={<About />} />
          <Route path="space" element={<Space />} />
          <Route path="space/detail" element={<CampaignDetail />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>
    </div>
  );
};

export default Content;
