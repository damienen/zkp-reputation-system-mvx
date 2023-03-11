import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { DappProvider } from "@multiversx/sdk-dapp/wrappers";
import {
  NotificationModal,
  SignTransactionsModals,
  TransactionsToastList,
} from "@multiversx/sdk-dapp/UI";
import { PageNotFound } from "./pages/PageNotFound";
import About from "./pages/About";
import Space from "./pages/Space";

function App() {
  return (
    <Router>
      <DappProvider
        environment="devnet"
        customNetworkConfig={{
          name: "customConfig",
          apiTimeout: 6000,
          walletConnectV2ProjectId: "a5a07b89bf08093c43938c81a8f1a937",
        }}
      >
        <TransactionsToastList />
        <NotificationModal />
        <SignTransactionsModals className="custom-class-for-modals" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/space" element={<Space />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </DappProvider>
    </Router>
  );
}

export default App;
