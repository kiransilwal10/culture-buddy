import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';// Correctly import the image

function Login() {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        setAuthing(true);
        try {
            const response = await signInWithPopup(auth, new GoogleAuthProvider());
            console.log(response.user.uid);
            console.log(response.user);
    
            // Save user data to session storage
            const userData = {
                email: response.user.email,
                name: response.user.displayName,
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
    
            // Make API call to check if company exists
            const checkResponse = await fetch('http://localhost:3000/api/companies/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employerEmail: response.user.email }),
            });
    
            const checkResult = await checkResponse.json();
    
            if (checkResponse.ok) {
                navigate('/bot-customization');
                const company = checkResult.company;
                const companyDetail = {
                    "companyName": company.companyName,
                    "employerEmail":company.employerEmail,
                    "industry": company.industry,
                    "numberOfWorkers": company.numberOfWorkers,
                    "botName": company.botName,
                    "coreValues": company.coreValues,
                    "botTone": company.botTone,
                    "botPersonality": company.botPersonality
                };
                sessionStorage.setItem('botData', JSON.stringify(companyDetail));
            } else {
                navigate('/bot-creator');
            }
        } catch (error) {
            console.log(error);
            setAuthing(false);
        }
    };

    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');
        signInWithEmailAndPassword(auth, email, password)
            .then((response) => {
                console.log(response.user.uid);
                navigate('/bot-creator');
            })
            .catch((error) => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen overflow-hidden">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div className="text-red-500">{error}</div>}
                        <Button onClick={signInWithEmail} disabled={authing} className="w-full bg-main hover:bg-main">
                            Login
                        </Button>
                        <Button onClick={signInWithGoogle} disabled={authing} variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <img
                    src="src/assets/hero_ai.png" // Use the imported image
                    alt="Image"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}

export default Login;