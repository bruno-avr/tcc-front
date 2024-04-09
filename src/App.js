import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Home from "./pages/Home";
import Teachers from "./pages/Teachers";
import Layout from "./components/Layout";
import Grades from "./pages/Grades";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/teachers" element={<Teachers />} />
          <Route exact path="/grades" element={<Grades />} />
          <Route exact path="/classes" element={<Classes />} />
          <Route exact path="/subjects" element={<Subjects />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
