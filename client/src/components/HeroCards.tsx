import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LightBulbIcon } from "./Icons";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">John Doe React</CardTitle>
            <CardDescription>@john_doe</CardDescription>
          </div>
        </CardHeader>

        <CardContent>I love my culture buddy!</CardContent>
      </Card>

      {/* Team */}
      <Card className="absolute right-[20px] top-4 w-80 h-[260px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardContent className="flex justify-center items-center p-0">
          <img
              src="src/assets/hero_ai.png"
              alt="AI Hero"
              className="w-full h-full object-fill"
          />
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="absolute top-[150px] left-[50px] w-72 h-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardContent className="flex justify-center items-center p-0">
          <img
              src="src/assets/chatbot.jpg"
              alt="Chatbot"
              className="w-full h-full object-cover"
          />
        </CardContent>
      </Card>

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Why Culture Buddy?</CardTitle>
            <CardDescription className="text-md mt-2">
              Foster a deep work culture by connecting employees
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
