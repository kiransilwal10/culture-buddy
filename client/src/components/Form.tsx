import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
    companyname: z.string().min(1, "Company name is required").max(255),
    industry: z.string().min(1, "Industry is required").max(255),
    companysize: z.coerce.number().min(1, "Company size must be at least 1"),
    corevalues: z.string().min(1, "Core values are required").max(255),
    botname: z.string().min(1, "Bot name is required").max(255),
    tone: z.string().min(1, "Tone is required").max(255),
    personality: z.string().min(1, "Personality is required").max(255),
})

export function MyForm() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyname: "",
            industry: "",
            companysize: 1,
            corevalues: "",
            botname: "",
            tone: "",
            personality: "",
        },
    })
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        setLoading(false);
                        return 100;
                    }
                    return prevProgress + 10;
                });
            }, 300);

            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(() => {
        if (!loading && progress === 100) {
            navigate("/bot-customization");
        }
    }, [loading, progress, navigate]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setProgress(0); // Reset progress when submitting
        console.log(values);
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Create Your ChatBot</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <Progress value={progress} className="w-full" />
                            <p className="text-center text-gray-600 dark:text-gray-400">Creating your ChatBot...</p>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="companyname"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Company Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your company name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="industry"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Industry</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your industry" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="companysize"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Company Size</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="Enter company size" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="corevalues"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Core Values</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your core values" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>
                                    )}
                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="botname"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>ChatBot Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter a name for your ChatBot" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tone</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter the desired tone" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="personality"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Personality</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Describe the bot's personality" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </Form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step === 2 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="w-[120px]"
                        >
                            Previous
                        </Button>
                    )}
                    {step === 1 ? (
                        <Button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-[120px] ml-auto"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            onClick={form.handleSubmit(onSubmit)}
                            className="w-[120px] ml-auto"
                        >
                            Submit
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}