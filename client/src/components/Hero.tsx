import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
      <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-12 gap-10">
        <div className="text-center lg:text-start space-y-6">
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Deploy
              <br/>
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
            <Button className="w-full md:w-1/3 bg-main hover:bg-main" onClick={handleGetStarted}>Get Started</Button>

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