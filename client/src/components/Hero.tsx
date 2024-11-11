import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Coffee,
 
  Camera,
  Music,
  PartyPopper,
  Book,
  Handshake,
  ChartBar,
  MonitorCheck,
} from "lucide-react";

const IconCloud = () => {
  const icons = [Coffee,  Camera, Music, PartyPopper, Book, Handshake,ChartBar, MonitorCheck];
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize(); // Initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate random positions and animations for each icon
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {icons.map((IconComponent, index) => {
        const size =  Math.random() * 34; // Random size between 30 and 80
        const initialX =  10 + Math.random() * windowSize.width;
        const initialY = -10 +  Math.random() * windowSize.height;
        const animateX = Math.random() * windowSize.width;
        const animateY = Math.random() * windowSize.height;
        const duration = 20 + Math.random() * 10; // Random duration between 20 and 30 second
        return (
          <motion.div
            key={index}
            className="absolute text-black-200"
            initial={{ x: initialX, y: initialY, opacity: 0.25 }}
            animate={{ x: animateX, y: animateY, opacity: 0.3, rotate: 360 }}
            transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
          >
            <IconComponent size={size} />
          </motion.div>
        );
      })}
    </div>
  );
};

export const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <section className="relative container grid lg:grid-cols-2 place-items-center py-20 md:py-12 gap-10">
      {/* IconCloud background */}
      <IconCloud />

      {/* Hero content */}
      <div className="text-center lg:text-start space-y-6 z-10">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Deploy
              <br />
            </span>{" "}
            your own
          </h1>{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Culture Buddy
            </span>{" "}
            for your company
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Build your own culture buddy for your company, and start saving time today.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3" onClick={handleGetStarted}>
            Get Started
          </Button>

          <a
            rel="noreferrer noopener"
            href="https://github.com/kiransilwal10/culture-buddy"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Github Repository
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
