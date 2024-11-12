import { useState } from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FaGoogle } from "react-icons/fa"

function Login() {
    const auth = getAuth()
    const navigate = useNavigate()

    const [authing, setAuthing] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const signInWithGoogle = async () => {
        setAuthing(true)
        try {
            const response = await signInWithPopup(auth, new GoogleAuthProvider())
            console.log(response.user.uid)
            console.log(response.user)

            const userData = {
                email: response.user.email,
                name: response.user.displayName,
            }
            sessionStorage.setItem('userData', JSON.stringify(userData))

            const checkResponse = await fetch('http://localhost:3000/api/companies/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employerEmail: response.user.email }),
            })

            const checkResult = await checkResponse.json()

            if (checkResponse.ok) {
                navigate('/bot-customization')
                const company = checkResult.company
                const companyDetail = {
                    "companyName": company.companyName,
                    "employerEmail": company.employerEmail,
                    "industry": company.industry,
                    "numberOfWorkers": company.numberOfWorkers,
                    "botName": company.botName,
                    "coreValues": company.coreValues,
                    "botTone": company.botTone,
                    "botPersonality": company.botPersonality
                }
                sessionStorage.setItem('botData', JSON.stringify(companyDetail))
            } else {
                navigate('/bot-creator')
            }
        } catch (error) {
            console.log(error)
            setAuthing(false)
        }
    }

    const signInWithEmail = async () => {
        setAuthing(true)
        setError('')
        signInWithEmailAndPassword(auth, email, password)
            .then((response) => {
                console.log(response.user.uid)
                navigate('/bot-creator')
            })
            .catch((error) => {
                console.log(error)
                setError(error.message)
                setAuthing(false)
            })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="w-full shadow-xl overflow-hidden border-l-4 border-purple-500">
                    <div className="p-8">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-purple-800">Welcome Back</CardTitle>
                            <CardDescription className="text-pink-600">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); signInWithEmail(); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-purple-700">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-purple-700">Password</Label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm text-pink-600 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                                    />
                                </div>
                                {error && <div className="text-red-500 text-sm">{error}</div>}
                                <Button type="submit" disabled={authing} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                                    Login
                                </Button>
                            </form>
                            <div className="mt-4 flex items-center justify-between">
                                <hr className="w-full border-gray-300" />
                                <span className="px-2 text-gray-500">OR</span>
                                <hr className="w-full border-gray-300" />
                            </div>
                            <Button onClick={signInWithGoogle} disabled={authing} variant="outline" className="w-full mt-4 border-pink-300 text-pink-700 hover:bg-pink-50">
                                <FaGoogle className="mr-2" /> Login with Google
                            </Button>
                            <div className="mt-6 text-center text-sm text-gray-600">
                                Don&apos;t have an account?{" "}
                                <Link to="/signup" className="font-medium text-pink-600 hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}

export default Login