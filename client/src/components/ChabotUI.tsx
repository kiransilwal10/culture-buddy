import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';

// Import OpenAI SDK and axios for API calls
import axios from 'axios';

export default function ChatbotUI() {
  const [messages, setMessages] = useState<{ type: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { type: "user", text: input }]);

      try {
        // Send input to OpenAI API
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions', 
          {
            model: "text-davinci-003", // Use the appropriate OpenAI model
            prompt: input, // Send the user's input as a prompt
            max_tokens: 15
          },
          {
            headers: {
              'Authorization': `Bearer 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`,
              'Content-Type': 'application/json',
            }
          }
        );

        // Get AI response
        const aiResponse = response.data.choices[0].text.trim();

        setMessages((prev) => [
          ...prev,
          { type: "bot", text: aiResponse }
        ]);
      } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Sorry, I couldn't understand that. Please try again." }
        ]);
      }

      // Clear input field
      setInput("");
    }
  };

  return (
    <div className="chatbot-container max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Chatbot</div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-80 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <Textarea
                value={message.text}
                readOnly
                className={`w-full ${message.type === "user" ? "text-right" : "text-left"}`}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSend}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
