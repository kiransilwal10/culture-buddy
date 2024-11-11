import { useState, ChangeEvent, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { FileIcon, XIcon, Upload, FileText, Rocket } from "lucide-react"
import { useToast } from "@/hooks/use-toast.ts"

interface FileWithPreview extends File {
    preview: string
    fileName: string
}

export default function BotCustomization() {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [botDescription, setBotDescription] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const navigate = useNavigate()

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

    const onSave = async () => {
        const formData = new FormData()

        console.log("Files to be uploaded:", files)

        const filePromises = files.map(async (fileObj) => {
            const fileName = fileObj.fileName
            const preview = fileObj.preview

            if (preview) {
                try {
                    const blob = await fetch(preview).then((res) => res.blob())
                    const file = new File([blob], fileName, { type: blob.type })
                    console.log("Created file:", file)
                    formData.append('documents', file)
                } catch (error) {
                    console.error("Error fetching blob:", error)
                }
            } else {
                console.warn("Preview not found for file:", fileObj)
            }
        })

        await Promise.all(filePromises)

        if (botDescription) {
            formData.append('description', botDescription)
        }

        console.log("FormData content:", [...formData.entries()])

        try {
            const response = await fetch('http://localhost:3000/uploadDocuments', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to upload documents')
            }

            const data = await response.json()
            console.log("Documents uploaded successfully:", data)
            toast({
                title: "Buddy Created",
                description: "Your buddy has been created successfully.",
            })
            navigate('/bot-edit')
        } catch (error) {
            console.error("Error uploading documents:", error)
            toast({
                title: "Error",
                description: "Failed to create buddy. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h1 className="text-4xl font-bold text-center mb-2 text-purple-800">Buddy Creation</h1>
                    <p className="text-center text-gray-600">Customize your AI assistant with unique knowledge and capabilities</p>
                </div>

                <Card className="shadow-lg bg-white border-l-4 border-rose-500">
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <FileText className="h-6 w-6 text-rose-500" />
                        <h2 className="text-2xl font-semibold text-rose-800">Customize Your Buddy</h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Add additional company information, rules, and values you would like the buddy to know</p>
                        <Textarea
                            placeholder="Describe your buddy here..."
                            value={botDescription}
                            onChange={(e) => setBotDescription(e.target.value)}
                            className="min-h-[150px] bg-gray-100 border-rose-200 focus:border-rose-500 focus:ring-rose-500"
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-lg bg-white border-l-4 border-indigo-500">
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <Upload className="h-6 w-6 text-indigo-500" />
                        <h2 className="text-2xl font-semibold text-indigo-800">Upload Documents</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">Choose the files you want your buddy to learn from.</p>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="cursor-pointer bg-gray-100 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <AnimatePresence>
                            {files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <FileIcon className="h-6 w-6 text-indigo-500" />
                                    <div className="grid gap-1 text-sm flex-grow">
                                        <div className="font-medium text-gray-800">{file.fileName || "Untitled File"}</div>
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
                    <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100">
                        Cancel
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                        onClick={onSave}
                    >
                        <Rocket className="mr-2 h-4 w-4" /> Create Buddy
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}