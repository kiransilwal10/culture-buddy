import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar.tsx";

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
            const handleIncrement = (prev: number) => {
                if (prev >= 100) {
                    return 100;
                }
                return prev + 10;
            };

            const interval = setInterval(() => {
                setProgress(handleIncrement);
            }, 300);

            setTimeout(() => {
                clearInterval(interval);
                setLoading(false);
                navigate("/bot-customization");
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [loading, navigate]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        console.log(values);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
            {loading ? (
                <AnimatedCircularProgressBar
                    max={100}
                    min={0}
                    value={progress}
                    gaugePrimaryColor="rgb(79 70 229)"
                    gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                />
            ) : (
                <Form {...form}>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 bg-white dark:bg-gray-800 shadow-md rounded-md max-w-lg w-full">
                        {step === 1 && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="companyname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-900 dark:text-gray-100">Company Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Company Name" {...field} className="border p-2 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100" />
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
                                            <FormLabel className="text-gray-900 dark:text-gray-100">Industry</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Industry" {...field} className="border p-2 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100" />
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
                                            <FormLabel className="text-gray-900 dark:text-gray-100">Company Size</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Company Size" {...field} className="border p-2 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100" />
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
                                            <FormLabel className="text-gray-900 dark:text-gray-100">Core Values</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Core Values" {...field} className="border p-2 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" onClick={() => setStep(2)} className="bg-blue-500 dark:bg-blue-700 text-white p-2 rounded-md">Next</Button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="botname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-900 dark:text-gray-100">ChatBot Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ChatBot Name" {...field} className="border p-2 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100" />
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
                                            <FormLabel className="text-gray-900 dark:text-gray-100">Tone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tone" {...field} className="border p-2 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100" />
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
                                            <FormLabel className="text-gray-900 dark:text-gray-100">Personality</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Personality" {...field} className="border p-2 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" onClick={() => setStep(1)} className="bg-blue-500 dark:bg-blue-700 text-white p-2 mr-4 rounded-md">Back</Button>
                                <Button type="submit" className="bg-blue-500 dark:bg-blue-700 text-white p-2 rounded-md">Submit</Button>
                            </>
                        )}
                    </form>
                </Form>
            )}
        </div>
    );
}