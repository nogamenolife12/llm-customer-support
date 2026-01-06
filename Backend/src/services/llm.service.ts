import OpenAI from "openai";
import { AppError } from "../utils/appError.js";
import { config } from "../../config/config.js";
const apiKey = config.openaiApiKey;
if(!apiKey){
    throw new Error("OPENAI_API_KEY environment variable is not set.");
}

const client = new OpenAI({
    baseURL :'https://api.groq.com/openai/v1',
    apiKey: apiKey,
})

interface LLMService {
    messages: {
        role: 'user' | 'assistant' | 'system';
        content: string;
    }[];
    model: string;
}
    

export async function llmReply({messages,model = `${process.env.OPENAI_MODEL}` }: LLMService): Promise<string> {

    try{
        const response = await client.chat.completions.create({
            model: model,
            messages: messages,
        });

        return response.choices[0]?.message?.content ?? "Sorry , I could not generate a response.";
    }catch(err){
        console.error("LLM Service Error:", err);
        throw new AppError("Our Agent is taking a nap, please try again later", 503);
    }
}