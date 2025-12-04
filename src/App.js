import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import ProductFormPage from "./components/ProductForm";
import { ViewProvider } from "./context/ViewContext";

function App() {
  return (
    <ViewProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/product-form" element={<ProductFormPage />} />
        </Routes>
      </Router>
    </ViewProvider>
  );
}

export default App;
