import React, { useState, useEffect } from "react";
import type { Message } from "../Types/types.ts";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { fetchConversation, sendChatMessage} from "../services/ChatApi.ts";

export const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationID, setConversationID] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load previous conversation
  useEffect(() => {
    const storedConversationID = localStorage.getItem("conversationID");
    if (!storedConversationID) return;

    setConversationID(storedConversationID);

    fetchConversation(storedConversationID)
      .then((data) => {
        const normalizedMessages: Message[] = data.messages.map(
          (msg: any, index: number) => ({
            id: index.toString(),
            sender: msg.sender === "ai" ? "ai" : "user",
            text: msg.text,
            createdAt: msg.createdAt,
          })
        );
        setMessages(normalizedMessages);
      })
      .catch(() => {
        localStorage.removeItem("conversationID");
      });
  }, []);


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const fetchAPI = "https://llm-customer-support.onrender.com/chat/message"
    try {
      const data = await sendChatMessage(input, conversationID || undefined); // Fetching from local backend
      setConversationID(data.conversationID);
      localStorage.setItem("conversationID", data.conversationID);

      const aiMessage: Message = {
        id: data.messageID,
        sender: "ai",
        text: data.aiReply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
    setMessages((prev)=>[...prev,{
        id: Date.now().toString(),
        sender: "system",
        text: (err as Error).message || "Failed to send message",
        createdAt: new Date().toISOString(),
    }])
    } finally {
      setLoading(false);
    }

    
  };

  const startNewChat = () => {
        setMessages([]);
        setConversationID(null);
        setInput("");

        localStorage.removeItem("conversationID");
    };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border border-gray-200 rounded-2xl shadow-xl bg-white overflow-hidden transition-all">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-500 font-medium">Online</span>
          </div>
        </div>
        <button 
          onClick={startNewChat}
          className="text-xs font-semibold uppercase tracking-wider text-gray-100 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all duration-200 active:scale-95"
        >
          New Chat
        </button>
      </div>

      <MessageList messages={messages} />
      
      {loading && (
        <div className="px-6 py-2">
          <div className="flex gap-2 items-center text-gray-400 text-xs italic animate-pulse">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
            </div>
            AI is thinking...
          </div>
        </div>
      )}

      <MessageInput 
        input={input} 
        setInput={setInput} 
        sendMessage={sendMessage} 
        loading={loading} 
      />
    </div>
  );
};

