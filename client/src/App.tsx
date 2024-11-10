
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import EmployeeChatBotCreator from "@/components/pages/EmployeeChatBotCreator.tsx";
import "./App.css";
import BotCustomization from "@/components/pages/BotCustomization.tsx";


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
        <Route path="/bot-creator" element={<EmployeeChatBotCreator />} />
        <Route path={"/bot-customization"} element={<BotCustomization />} />
      </Routes>
      <ScrollToTop />
    </Router>
  );
}

export default App;
