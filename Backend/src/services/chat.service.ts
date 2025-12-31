import { prisma } from "../db/prisma.js";
import { Sender } from "@prisma/client";
import { llmReply } from "./llm.service.js";
import { AppError } from "../utils/appError.js";

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };
const STORE_CONTEXT = `
You are the assistant for "TechWorld Store". 
Store Policies: 
- Returns: 30 days with receipt.
- Shipping: Free over $50.
- Location: Online only.
`;

const chatService = async(message:string, conversationID?:string)=>{
    let conversationIdToUse = conversationID;

//If no conversationID is provided, create a new conversation
    if(conversationID == undefined || conversationID == null){
        const conversation = await prisma.conversation.create({
            data:{},
        })
        conversationIdToUse = conversation.id;
    }

    
//Create user message
    const userMessage = await prisma.message.create({
        data:{
            conversationId: conversationIdToUse!,
            sender: Sender.user,
            text: message,
        }
    })

//Fetch all messages in the conversation
    const conversationWithMessages = await prisma.conversation.findUnique({
        where:{id: conversationIdToUse!},
        include:{messages: true}
    })

//Prepare messages for LLM
    const llmMessages : ChatMessage[] = [
        {
            role:'system',
            content: STORE_CONTEXT,
        },
        ...conversationWithMessages!.messages.map(msg=>({
            role: (msg.sender === Sender.user ? 'user' : 'assistant') as 'user' | 'assistant',
            content: msg.text,
        })),
    ]

//Get LLM response
    const llmResponse =  await llmReply({
        messages: llmMessages,
        model: `${process.env.OPENAI_MODEL}`
    });
   
//Store AI message
    const aiMessage = await prisma.message.create({
        data:{
            conversationId: conversationIdToUse!,
            sender: Sender.ai,
            text: llmResponse,
        }
    })

//Return response
    return {
        conversationID: conversationIdToUse,
        messageID: userMessage.id,
        aiReply: llmResponse,
        status: "Message received"
    };
}

const getConversation = async (conversationID:string) => {
    const conversation = await prisma.conversation.findUnique({
        where:{id: conversationID},
        include:{messages: true}
    });

    if(!conversation){
        throw new AppError("Conversation not found");
    }

    return conversation;
}

export {chatService,getConversation};