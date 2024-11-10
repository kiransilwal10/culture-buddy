import { useState, ChangeEvent, useRef } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { FileIcon, XIcon } from "lucide-react"

interface FileWithPreview extends File {
    preview: string
    fileName: string
}

export default function BotCustomization() {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [botDescription, setBotDescription] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

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
            URL.revokeObjectURL(prevFiles[index].preview)
            return prevFiles.filter((_, i) => i !== index)
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-center mb-8 text-black"
            >
                Buddy Customization
            </motion.h1>
            <div className="max-w-2xl mx-auto space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-black">Customize Your Buddy</h2>
                        <p className="text-muted-foreground">Add additional company information, rules, and values you would like the buddy to know</p>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Describe your bot here..."
                            value={botDescription}
                            onChange={(e) => setBotDescription(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-black">Upload Documents</h2>
                        <p className="text-muted-foreground">Choose the files you want your bot to learn from.</p>
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
                    <CardFooter className="flex justify-end space-x-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}