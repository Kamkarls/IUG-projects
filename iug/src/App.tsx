import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import UserView from "./pages/userprofile";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UploadProject from "./pages/UploadProject";
import UploadExperienceReport from "./pages/UploadExperienceReport";
import Error from "./pages/404";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FirebaseAuthProvider } from "./services/AuthContext";
import React from "react";

function App() {
  //set default colors for all mui components
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3D7844", // green color
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FirebaseAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/User" element={<UserView />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/project/:id" element={<ProjectDetailsPage />} />
              <Route path="/uploadProject" element={<UploadProject />} />
              <Route
                path="/uploadexperienceReport"
                element={<UploadExperienceReport />}
              />
              <Route path="/404" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </FirebaseAuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
