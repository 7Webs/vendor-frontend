import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from "./theme/theme";
import { routes } from "./utils/routes";
import { AllProviders } from "./utils/contexts/AllContext";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AllProviders>
        <Routes>
          {routes.public.map((route) => (
            <Route key={route.path} {...route} />
          ))}
          {routes.protected.map((route) => (
            <Route key={route.path || 'protected'} {...route}>
              {route.children?.map((childRoute) => (
                <Route key={childRoute.path} {...childRoute} />
              ))}
            </Route>
          ))}
        </Routes>
      </AllProviders>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
      />
    </ThemeProvider>

  );
}

export default App;
