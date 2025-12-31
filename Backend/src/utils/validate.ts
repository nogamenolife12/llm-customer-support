const validator = function(message: any, conversationID: any): any {
    if(typeof message !== 'string' || message.trim() === ''){
        throw new Error("Validation Error: Message must be a non-empty string");
    }
    if (conversationID !== undefined && conversationID !== null) {
        if (typeof conversationID !== "string" || conversationID.trim() === "") {
            throw new Error("Conversation ID must be a non-empty string if provided");
        }
    }
}

export {validator}