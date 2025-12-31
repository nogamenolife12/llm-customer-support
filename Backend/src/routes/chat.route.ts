import { chatService } from "../services/chat.service.js";
import { validator } from "../utils/validate.js";
import express from "express";


const router = express.Router();
router.use(express.json());

router.post('/message',async (req,res)=>{
    console.log("Raw body:", req.body);
    console.log("Message:", req.body?.message);
    console.log("ConversationID:", req.body?.conversationID);
    const {message , conversationID } = req.body;
    try{
        //we are validating the inputs here
        validator(message, conversationID);
        console.log("Validation successful");

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