import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from "./theme/theme";
import { routes } from "./utils/routes";
import { AllProviders } from "./utils/AllContext";
import "./App.css";
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
    </ThemeProvider>
  );
}

export default App;
