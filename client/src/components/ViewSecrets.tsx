import { useState } from 'react'
import { Eye, EyeOff, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function ViewSecrets({ apiKey = "api_live_abcdefghijklmnopqrstuvwxyz123456", secretKey = "sk_live_abcdefghijklmnopqrstuvwxyz123456" }) {
    const [showApiKey, setShowApiKey] = useState(false)
    const [showSecretKey, setShowSecretKey] = useState(false)

    const maskString = (str: string) => '*'.repeat(str.length)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <Card className="w-[250px] mx-auto border-none shadow-none"> {/* Removed border, reduced width */}
            <CardContent className="p-4"> {/* Reduced padding for compactness */}
                <div className="space-y-3"> {/* Reduced spacing between sections */}
                    <div className="space-y-1">
                        <Label htmlFor="apiKey" className="text-sm font-medium">
                            API Key
                        </Label>
                        <div className="flex items-center">
                            <Input
                                id="apiKey"
                                value={showApiKey ? apiKey : maskString(apiKey)}
                                readOnly
                                className="flex-grow p-1"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowApiKey(!showApiKey)}
                                aria-label={showApiKey ? "Hide API Key" : "Show API Key"}
                            >
                                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(apiKey)}
                                aria-label="Copy API Key"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="secretKey" className="text-sm font-medium">
                            Secret Key
                        </Label>
                        <div className="flex items-center">
                            <Input
                                id="secretKey"
                                value={showSecretKey ? secretKey : maskString(secretKey)}
                                readOnly
                                className="flex-grow p-1"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSecretKey(!showSecretKey)}
                                aria-label={showSecretKey ? "Hide Secret Key" : "Show Secret Key"}
                            >
                                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(secretKey)}
                                aria-label="Copy Secret Key"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
