import { chatService,getConversation } from "../services/chat.service.js";
import { validator,validateConversationID } from "../utils/validate.js";
import express from "express";


const router = express.Router();
router.use(express.json());

//GET /chat/:conversationID
router.get('/:conversationID', async(req,res)=>{
    const {conversationID} = req.params;
        //validating conversationID
        validateConversationID(conversationID);
        console.log("Validation successful for conversationID:", conversationID);
        
        //Fetch chat history from service
        let response = await getConversation(conversationID);
        
        const messages = response.messages
        .sort((a,b)=> a.createdAt.getTime() - b.createdAt.getTime())
        .map(msg=>({
            sender: msg.sender,
            text: msg.text,
            createdAt:msg.createdAt
        }));
        console.log("Fetched conversation with messages:", messages);
        return res.status(200).json({
            conversationID: response.id,
            messages: messages,
        })
})

//POST /chat/message
router.post('/message',async (req,res)=>{
    console.log("Raw body:", req.body);
    console.log("Message:", req.body?.message);
    console.log("ConversationID:", req.body?.conversationID);
    const {message , conversationID } = req.body;
    
        //we are validating the inputs here
        validator(message, conversationID);
        console.log("Validation successful");
    try{
        //Call service logic
        let response = await chatService(message,conversationID);
        console.log("Service response:", response);

        //Send success response
        res.status(200).json(response);
    }catch(err){
        console.error("Error occurred:", err);
        res.status(400).send({error: "AN ERROR OCCURED", message: (err as Error).message});
    }
})

export default router;