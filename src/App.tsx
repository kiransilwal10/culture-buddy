
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Main Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
            </>
          }
        />

        {/* Signup and Login Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ScrollToTop />
    </Router>
  );
}

export default App;
