import { prisma } from "../db/prisma.js";
import { Sender } from "@prisma/client";
import { llmReply } from "./llm.service.js";

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

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
            content: 'You are a helpful AI assistant. Provide concise and relevant answers to user queries.',   
        },
        ...conversationWithMessages!.messages.map(msg=>({
            role: (msg.sender === Sender.user ? 'user' : 'assistant') as 'user' | 'assistant',
            content: msg.text,
        })),
        {
            role: 'user',
            content: message,
        }
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

export {chatService};