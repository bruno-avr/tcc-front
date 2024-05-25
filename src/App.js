import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Home from "./pages/Home";
import Schedules from "./pages/Schedules";
import Teachers from "./pages/Teachers";
import Layout from "./components/Layout";
import Grades from "./pages/Grades";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import AppContextProvider from "./context/AppContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ViewSchedules from "./pages/Schedules/View";
import ViewSchedule from "./pages/Schedules/View/Schedule";
import GenerateSchedule from "./pages/Schedules/Generate";

function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppContextProvider>
          <Layout>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/schedules/view/:id" element={<ViewSchedule />} />
              <Route exact path="/schedules/view" element={<ViewSchedules />} />
              <Route
                exact
                path="/schedules/generate"
                element={<GenerateSchedule />}
              />
              <Route exact path="/schedules" element={<Schedules />} />
              <Route exact path="/teachers" element={<Teachers />} />
              <Route exact path="/grades" element={<Grades />} />
              <Route exact path="/classes" element={<Classes />} />
              <Route exact path="/subjects" element={<Subjects />} />
            </Routes>
          </Layout>
        </AppContextProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
