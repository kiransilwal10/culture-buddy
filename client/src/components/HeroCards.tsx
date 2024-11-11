import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LightBulbIcon } from "@/components/Icons"
import { motion } from "framer-motion"

export const HeroCards = () => {
  return (
      <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
        {/* Testimonial */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 bg-gradient-to-br from-purple-100 to-pink-100 border-l-4 border-purple-500">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage
                    alt=""
                    src="https://github.com/shadcn.png"
                />
                <AvatarFallback>SH</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <CardTitle className="text-lg text-purple-800">John Doe Employer</CardTitle>
                <CardDescription className="text-pink-600">@john_doe</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="text-purple-700">I love my culture buddy!</CardContent>
          </Card>
        </motion.div>

        {/* Team */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="absolute right-[20px] top-4 w-80 h-[260px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 overflow-hidden border-l-4 border-blue-500">
            <CardContent className="flex justify-center items-center p-0">
              <img
                  src="src/assets/hero_ai.png"
                  alt="AI Hero"
                  className="w-full h-full object-cover"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="absolute top-[150px] left-[50px] w-72 h-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10 overflow-hidden border-l-4 border-teal-500">
            <CardContent className="flex justify-center items-center p-0">
              <img
                  src="src/assets/chatbot.jpg"
                  alt="Chatbot"
                  className="w-full h-full object-cover"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Service */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="absolute w-[350px] -right-[10px] bottom-[35px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 bg-gradient-to-br from-blue-100 to-green-100 border-l-4 border-green-500">
            <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
              <div className="mt-1 bg-blue-500/20 p-1 rounded-2xl">
                <LightBulbIcon />
              </div>
              <div>
                <CardTitle className="text-blue-800">Why Culture Buddy?</CardTitle>
                <CardDescription className="text-md mt-2 text-teal-700">
                  Foster a deep work culture by connecting employees
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
  )
}