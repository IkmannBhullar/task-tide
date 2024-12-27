import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/theme";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Router>
        <nav style={{ padding: "10px", backgroundColor: "#f1e8e0" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Dashboard</Link>
          <Link to="/journal">Journal</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;