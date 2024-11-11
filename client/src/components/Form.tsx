import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
    companyname: z.string().min(1).max(255),
    industry: z.string().min(1).max(255),
    companysize: z.coerce.number(),
    corevalues: z.string().min(1).max(255),
    botname: z.string().min(1).max(255),
    tone: z.string().min(1).max(255),
    personality: z.string().min(1).max(255),
});

export function MyForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
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
    });
    const navigate = useNavigate();

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true); 
        const storedUser = sessionStorage.getItem('userData');
        let userEmail = "";
        if (storedUser) {
            const user = JSON.parse(storedUser);
            userEmail = user.email;
        }
        try {
          // Make the API call to save the company data
          const response = await fetch("http://localhost:3000/api/companies/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName: values.companyname,
              employerEmail: userEmail,
              industry: values.industry,
              numberOfWorkers: values.companysize,
              botName: values.botname,
              coreValues: values.corevalues,
              botTone: values.tone,
              botPersonality: values.personality,
            }),
          });
    
          if (!response.ok) {
            throw new Error("Failed to save company");
          }
    
          const data = await response.json();
          console.log("Company saved:", data); 

        const uploadResponse = await fetch("http://localhost:3000/uploadJsonDocument", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject: "Bot Detail",
                jsonData: JSON.stringify({
                    companyName: values.companyname,
                    industry: values.industry,
                    numberOfWorkers: values.companysize,
                    coreValues: values.corevalues,
                    botName: values.botname,
                    botTone: values.tone,
                    botPersonality: values.personality,
                }),
            }),
        });

        if (!uploadResponse.ok) {
            throw new Error("Failed to upload JSON document");
        }

        const uploadData = await uploadResponse.json();
        console.log("Document uploaded:", uploadData);

    
          setLoading(false);
          navigate("/bot-customization"); 
        } catch (error) {
          console.error("Error submitting form:", error);
          setLoading(false); 
          alert("Failed to save company. Please try again.");
        }
      }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">Create Your ChatBot</CardTitle>
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