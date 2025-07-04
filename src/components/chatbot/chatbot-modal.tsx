"use client";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Send, User, Bot, Loader2 } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { marked } from "marked";

const N8N_WEBHOOK_URL = "https://belckroptrabajo.app.n8n.cloud/webhook/chatbot-api";

// Servicio de comunicación con n8n
class InternalChatbotService {
  WEBHOOK_URL: string;
  constructor() {
    this.WEBHOOK_URL = N8N_WEBHOOK_URL;
  }

  async sendMessage(
    question: string,
    chatHistory: Array<{ role: string; content: string }> = [],
    userId: string | null = null
  ) {
    try {
      const finalUserId = userId || this.generateUserId();

      const response = await fetch(this.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          chatHistory: chatHistory.slice(-10),
          userId: finalUserId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("✅ Respuesta recibida del webhook:", data);

      if (typeof data === "object" && data.answer) {
        return {
          success: true,
          answer: data.answer,
          timestamp: data.timestamp,
          status: data.status,
          metadata: data.metadata,
        };
      } else {
        return {
          success: false,
          answer: "⚠️ No se recibió una respuesta válida del servidor.",
        };
      }
    } catch (error: any) {
      console.error("❌ Error en InternalChatbotService:", error);
      return {
        success: false,
        answer:
          "Lo siento, ocurrió un error al procesar tu mensaje. Intenta nuevamente.",
        error: error.message,
      };
    }
  }

  generateUserId() {
    let userId = localStorage.getItem("chatbot_user_id");
    if (!userId) {
      userId =
        "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chatbot_user_id", userId);
    }
    return userId;
  }
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: Dictionary["common"];
}

export function ChatbotModal({ isOpen, onClose, dictionary }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const chatbotService = useRef(new InternalChatbotService());

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      const id = chatbotService.current.generateUserId();
      setUserId(id);
      setMessages([]);
      setInputValue("");
      setIsLoading(false);
      setTimeout(() => {
        sendInitialGreeting(id);
      }, 100);
    }
  }, [isOpen]);

  const sendInitialGreeting = async (currentUserId: string) => {
    setIsLoading(true);
    try {
      const response = await chatbotService.current.sendMessage(
        "",
        [],
        currentUserId
      );
      const initialMessage = {
        id: Date.now().toString() + "bot",
        text:
          response.answer ||
          "Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?",
        sender: "bot" as const,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    } catch (error) {
      setMessages([
        {
          id: Date.now().toString() + "error",
          text:
            "Hubo un error inesperado al iniciar el asistente. Por favor, inténtalo más tarde.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + "user",
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatHistoryForService = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        content: msg.text,
      }));

      chatHistoryForService.push({
        role: "user",
        content: userMessage.text,
      });

      const response = await chatbotService.current.sendMessage(
        userMessage.text,
        chatHistoryForService,
        userId
      );

      const botMessage: Message = {
        id: Date.now().toString() + "bot",
        text:
          response.answer ||
          "⚠️ No se recibió una respuesta válida del servidor.",
        sender: "bot",
        timestamp: response.timestamp ? new Date(response.timestamp) : new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "error",
          text:
            "Lo siento, ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] flex flex-col h-[70vh] max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Asistente IA de Made
          </DialogTitle>
          <DialogDescription>
            Pregúntame sobre maderas, propiedades, usos y más.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow p-4 border rounded-md bg-muted/20" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[75%] rounded-lg p-3 text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border"
                }`}>
                  {msg.sender === "bot" ? (
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
                  ) : (
                    <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                  )}
                  <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-right text-primary-foreground/70" : "text-left text-muted-foreground/70"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot size={18} />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[75%] rounded-lg p-3 text-sm bg-card text-card-foreground border">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2 items-center">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Haz tu pregunta aquí..."
              className="flex-grow"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Enviar">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
