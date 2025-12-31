import { AppError } from "./appError.js";

const validator = function(message: any, conversationID: any): void {
    if (typeof message !== "string") {
        throw new AppError("Message must be a string", 400);
    }
    if (message.trim() === "") {
        throw new AppError("Message cannot be empty", 400);
    }
    if (message.length > 2000) {
        throw new AppError("Message is too long", 400);
    }
    if (conversationID !== undefined && conversationID !== null) {
        if (typeof conversationID !== "string" || conversationID.trim() === "") {
            throw new AppError("Conversation ID must be a non-empty string if provided",400);
        }
    }
}

const validateConversationID = function(conversationID: any):void{
    if(conversationID === undefined || conversationID === null){
        throw new AppError("Conversation ID is required", 400);
    }
    if(typeof conversationID !== "string"){
        throw new AppError("Conversation ID must be a string", 400);
    }
    if(conversationID.trim() === ""){
        throw new AppError("Conversation ID cannot be empty", 400);
    } 
}

export {validator, validateConversationID}