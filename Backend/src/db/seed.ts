import { prisma } from  "../db/prisma.js";

async function seed(){
    console.log("Seeding database...");

    const conversation = await prisma.conversation.create({
        data:{
            messages: {
                create : [
                {
                    sender : "user",
                    text : "what is your return policy?" 
                },
                {
                    sender : "ai",
                    text : "Our return policy allows returns within 30 days of purchase with a valid receipt."
                }
                ]
            }
        }
    });
} 

seed()
    .catch((err)=>{
        console.error("Seed failed")
        process.exit(1)
    })
    .finally(async()=>{
        await prisma.$disconnect();
    })