"use client"

import { useState, ChangeEvent, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileIcon, XIcon, Save, ArrowLeft, Copy, Check, Eye, Settings, Code, FileText, Upload } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast.ts"

interface FileWithPreview extends File {
    preview: string
    fileName: string
}

export default function BotEdit() {
    const [botDescription, setBotDescription] = useState("")
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [iframeCopied, setIframeCopied] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const iframeCode = '<iframe src="https://your-bot-url.com" width="100%" height="600" frameborder="0"></iframe>'

    useEffect(() => {
        // Simulating fetching existing bot data
        setBotDescription("")
        setFiles([
            { name: "existing-file-1.pdf", size: 1024 * 1024, preview: "", fileName: "handbook-1.pdf" },
        ] as FileWithPreview[])
    }, [])

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = Array.from(event.target.files || []).map((file) => ({
            ...file,
            preview: URL.createObjectURL(file),
            fileName: file.name,
        }))
        setFiles((prevFiles) => [...prevFiles, ...uploadedFiles])

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => {
            if (prevFiles[index].preview) {
                URL.revokeObjectURL(prevFiles[index].preview)
            }
            return prevFiles.filter((_, i) => i !== index)
        })
    }

    const handleSave = () => {
        // Simulating save operation
        console.log("Saving bot description:", botDescription)
        console.log("Saving files:", files)
        toast({
            title: "Changes Saved",
            description: "Your bot has been updated successfully.",
        })
    }

    const copyIframeCode = () => {
        navigator.clipboard.writeText(iframeCode)
        setIframeCopied(true)
        toast({
            title: "Iframe Code Copied",
            description: "The iframe code has been copied to your clipboard.",
        })
        setTimeout(() => setIframeCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-md">
                    <h1 className="text-4xl font-bold text-purple-800">Bot Edit Hub</h1>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="shadow-lg bg-white border-l-4 border-purple-500">
                        <CardHeader className="flex flex-row items-center space-x-2">
                            <Code className="h-6 w-6 text-purple-500" />
                            <h2 className="text-2xl font-semibold text-purple-800">Deploy Bot</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">Copy the iframe code to embed your bot on your website.</p>
                            <div className="bg-gray-100 p-4 rounded-md relative">
                                <pre className="text-sm overflow-x-auto text-gray-800">{iframeCode}</pre>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="absolute top-2 right-2 bg-purple-500 text-white hover:bg-purple-600"
                                    onClick={copyIframeCode}
                                >
                                    {iframeCopied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">{iframeCopied ? "Copied" : "Copy iframe code"}</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg bg-white border-l-4 border-pink-500">
                        <CardHeader className="flex flex-row items-center space-x-2">
                            <Settings className="h-6 w-6 text-pink-500" />
                            <h2 className="text-2xl font-semibold text-pink-800">API Credentials</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="api-key" className="text-sm font-medium text-gray-700">
                                    API Key
                                </label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="api-key"
                                        type="password"
                                        value="1234567890abcdef1234567890abcdef"
                                        readOnly
                                        className="font-mono bg-gray-100"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-pink-500 text-pink-500 hover:bg-pink-100"
                                        onClick={() => {
                                            const input = document.getElementById('api-key') as HTMLInputElement;
                                            if (input.type === 'password') {
                                                input.type = 'text';
                                            } else {
                                                input.type = 'password';
                                            }
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">Toggle API Key visibility</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="secret-key" className="text-sm font-medium text-gray-700">
                                    Secret Key
                                </label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="secret-key"
                                        type="password"
                                        value="abcdef1234567890abcdef1234567890"
                                        readOnly
                                        className="font-mono bg-gray-100"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-pink-500 text-pink-500 hover:bg-pink-100"
                                        onClick={() => {
                                            const input = document.getElementById('secret-key') as HTMLInputElement;
                                            if (input.type === 'password') {
                                                input.type = 'text';
                                            } else {
                                                input.type = 'password';
                                            }
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">Toggle Secret Key visibility</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="shadow-lg bg-white border-l-4 border-rose-500">
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <FileText className="h-6 w-6 text-rose-500" />
                        <h2 className="text-2xl font-semibold text-rose-800">Bot Description</h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Write your bot's new personality and purpose.</p>
                        <Textarea
                            placeholder="Describe your bot here..."
                            value={botDescription}
                            onChange={(e) => setBotDescription(e.target.value)}
                            className="min-h-[100px] bg-gray-100"
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-lg bg-white border-l-4 border-indigo-500">
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <Upload className="h-6 w-6 text-indigo-500" />
                        <h2 className="text-2xl font-semibold text-indigo-800">Bot Documents</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">Add or remove documents for your bot to learn from.</p>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="cursor-pointer bg-gray-100"
                        />
                        <AnimatePresence>
                            {files.map((file, index) => (
                                <motion.div
                                    key={file.fileName}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <FileIcon className="h-6 w-6 text-indigo-500" />
                                    <div className="grid gap-1 text-sm flex-grow">
                                        <div className="font-medium text-gray-800">{file.fileName}</div>
                                        <div className="text-gray-500">
                                            {file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "Unknown size"}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <XIcon className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                    <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100">Cancel</Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}