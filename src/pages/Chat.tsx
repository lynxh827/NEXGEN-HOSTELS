
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ChatMessage from "@/components/ChatMessage";
import { Message } from "@/utils/types";

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addMessage, conversations } = useBooking();
  
  const isAdmin = user?.role === "admin";
  
  // Mock conversations from context (this would come from BookingContext)
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      // Ensure all message timestamps are Date objects
      const messagesWithDateTimestamps = conversations.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      }));
      setMessages(messagesWithDateTimestamps);
    } else {
      // Add a welcome message if no messages exist
      const welcomeMessage = {
        id: "welcome",
        content: isAdmin
          ? "Welcome to the admin support panel. Students will message you here for assistance."
          : "Welcome to hostel support! How can we help you today?",
        sender: isAdmin ? "System" : "Admin",
        senderId: "system",
        timestamp: new Date(),
        isAdmin: true,
      };
      setMessages([welcomeMessage]);
    }
  }, [conversations, isAdmin]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: user?.name || user?.email || "User",
      senderId: user?.id || "unknown",
      timestamp: new Date(),
      isAdmin: user?.role === "admin",
    };

    setMessages((prev) => [...prev, newMessage]);
    
    // If we had a real API, we would send the message to the server here
    if (addMessage) {
      addMessage(newMessage);
    }
    
    // Clear input after sending
    setInput("");
    
    // Mock response for demo purposes
    if (!isAdmin) {
      setTimeout(() => {
        const responseMessage: Message = {
          id: Date.now().toString(),
          content: "Thank you for your message. An administrator will get back to you shortly.",
          sender: "Admin Support",
          senderId: "admin-support",
          timestamp: new Date(),
          isAdmin: true,
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="flex-1 text-center">
              {isAdmin ? "Student Support Chat" : "Hostel Support Chat"}
            </CardTitle>
            <div className="w-8" /> {/* Spacer for centering the title */}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                content={msg.content}
                sender={msg.sender}
                timestamp={msg.timestamp}
                isAdmin={msg.isAdmin}
                isCurrentUser={msg.senderId === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
