import React , {useEffect , useRef } from "react";
import type { Message } from "../Types/types.ts";

type props = {
    messages: Message[];
}

export const MessageList: React.FC<props> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40">
           <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
        </div>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] px-4 py-3 shadow-sm transition-all duration-300 ${
              msg.sender === "user" 
                ? "bg-blue-600 text-white rounded-2xl rounded-tr-none" 
                : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none border border-gray-200"
            }`}
          >
            <p className="text-sm leading-relaxed">{msg.text}</p>
            <span className={`text-[10px] mt-1 block opacity-60 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
               {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};