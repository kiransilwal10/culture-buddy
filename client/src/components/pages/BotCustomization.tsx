import { useState, ChangeEvent, useRef } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { FileIcon, XIcon, Eye, EyeOff, Copy } from "lucide-react"

interface FileWithPreview extends File {
    preview: string
    fileName: string
}

export default function BotCustomization() {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showUserId, setShowUserId] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)

    const userId = "user_1234567890"
    const apiKey = "sk_live_abcdefghijklmnopqrstuvwxyz123456"

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = Array.from(event.target.files || []).map((file) => ({
            ...file,
            preview: URL.createObjectURL(file),
            fileName: file.name,
        }))
        setFiles((prevFiles) => [...prevFiles, ...uploadedFiles])

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => {
            URL.revokeObjectURL(prevFiles[index].preview)
            return prevFiles.filter((_, i) => i !== index)
        })
    }

    const maskString = (str: string) => '*'.repeat(str.length)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-center text-black mb-8 text-primary"
            >
                Bot Customization
            </motion.h1>
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-primary">Sensitive Information</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userId" className="text-sm font-medium">
                                User ID
                            </Label>
                            <div className="flex">
                                <Input
                                    id="userId"
                                    value={showUserId ? userId : maskString(userId)}
                                    readOnly
                                    className="flex-grow"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowUserId(!showUserId)}
                                    aria-label={showUserId ? "Hide User ID" : "Show User ID"}
                                >
                                    {showUserId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(userId)}
                                    aria-label="Copy User ID"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apiKey" className="text-sm font-medium">
                                API Key
                            </Label>
                            <div className="flex">
                                <Input
                                    id="apiKey"
                                    value={showApiKey ? apiKey : maskString(apiKey)}
                                    readOnly
                                    className="flex-grow"
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
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-primary">Upload Documents</h2>
                        <p className="text-muted-foreground">Choose the files you want your buddy to remember.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="cursor-pointer"
                        />
                        <AnimatePresence>
                            {files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="border border-border rounded-lg p-4 flex items-center gap-4 bg-card hover:bg-accent transition-colors"
                                >
                                    <FileIcon className="h-6 w-6 text-primary" />
                                    <div className="grid gap-1 text-sm flex-grow">
                                        <div className="font-medium">{file.fileName || "Untitled File"}</div>
                                        <div className="text-muted-foreground">
                                            {file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "Unknown size"}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <XIcon className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}