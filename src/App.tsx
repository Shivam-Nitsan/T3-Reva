import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DynamicPage from "./pages/DynamicPage";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<DynamicPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
