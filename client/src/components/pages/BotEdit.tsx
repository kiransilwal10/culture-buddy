import { useState, ChangeEvent, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileIcon, XIcon, Save, ArrowLeft, Copy, Check, Eye } from "lucide-react"
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

    const handleSave = async () => {
        // Simulating save operation
        if(botDescription != ""){
            try {
                const response = await fetch('http://localhost:3000/uploadText', { 
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ botDescription }),
                });
            
                if (!response.ok) {
                  const errorData = await response.json();
                  console.error('Error:', errorData.error);
                  throw new Error(`Failed to upload JSON document: ${errorData.error}`);
                }
            
                const responseData = await response.json();
                if(files.length == 0){
                    toast({
                        title: "Changes Saved",
                        description: "Your bot has been updated successfully.",
                    })
                }
                console.log('Success:', responseData.message);
              } catch (error) {
                console.error('Error calling uploadJsonDocument API:', error);
                throw error;
              }
        }

        if(files.length !== 0){
            const formData = new FormData()

            // Log files before appending to FormData
            console.log("Files to be uploaded:", files)
    
            // Use Promise.all to ensure asynchronous tasks are completed before moving forward
            const filePromises = files.map(async (fileObj) => {
                const fileName = fileObj.fileName
                const preview = fileObj.preview // This is likely a Blob URL
    
                if (preview) {
                    // Convert the Blob URL to a Blob object
                    try {
                        const blob = await fetch(preview).then((res) => res.blob())
    
                        // Create a new File object from the Blob and fileName
                        const file = new File([blob], fileName, { type: blob.type })
                        console.log("Created file:", file)
    
                        // Append the new file to FormData
                        formData.append('documents', file)
                    } catch (error) {
                        console.error("Error fetching blob:", error)
                    }
                } else {
                    console.warn("Preview not found for file:", fileObj)
                }
            })
    
            // Wait for all promises to resolve
            await Promise.all(filePromises)
    
            // Log FormData content after all files have been appended
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
                    title: "Changes Saved",
                    description: "Your bot has been updated successfully.",
                })
            } catch (error) {
                console.error("Error uploading documents:", error)
            }
        }

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
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto space-y-8"
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-semibold text-black">Buddy Hub</h1>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </div>
                <Card className="shadow-lg">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-black">Deploy Buddy</h2>
                        <p className="text-muted-foreground">Copy the iframe code to embed your bot on your website.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted p-4 rounded-md relative">
                            <pre className="text-sm overflow-x-auto">{iframeCode}</pre>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2"
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
                <Card className="shadow-lg">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-black">API Credentials</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="api-key" className="text-sm font-medium">
                                API Key
                            </label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="api-key"
                                    type="password"
                                    value="Zavb3SDVb52nbclCSwnbcl2d"
                                    readOnly
                                    className="font-mono"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
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
                            <label htmlFor="secret-key" className="text-sm font-medium">
                                Secret Key
                            </label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="secret-key"
                                    type="password"
                                    value="akcu31scWvcbakcaacRT5vcScew"
                                    readOnly
                                    className="font-mono"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
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
                <Card className="shadow-lg">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-black">Change Buddy's Description</h2>
                        <p className="text-muted-foreground">Write your bot's new personality and purpose.</p>
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
                        <h2 className="text-2xl font-semibold text-black">Add New Documents</h2>
                        <p className="text-muted-foreground">Add or remove documents for your buddy to learn from.</p>
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
                                    key={file.fileName}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="border border-border rounded-lg p-4 flex items-center gap-4 bg-card hover:bg-accent transition-colors"
                                >
                                    <FileIcon className="h-6 w-6 text-black" />
                                    <div className="grid gap-1 text-sm flex-grow">
                                        <div className="font-medium">{file.fileName}</div>
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
                </Card>



                <div className="flex justify-end space-x-4">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-main hover:bg-main" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}