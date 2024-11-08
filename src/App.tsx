import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import router
import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { Newsletter } from "./components/Newsletter";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Team } from "./components/Team";
import { Testimonials } from "./components/Testimonials";

// Import ChatbotUI component
import ChatbotUI from "/Users/stephenjoshi/Desktop/shadcn-landing-page-main/src/components/ChabotUI.tsx";  // Adjust the path according to your project structure

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cta" element={<Cta />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/team" element={<Team />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/footer" element={<Footer />} />
        
        {/* Add a route for the Chatbot UI */}
        <Route path="/chatbot" element={<ChatbotUI />} />
      </Routes>

      <ScrollToTop />
    </Router>
  );
}

export default App;
