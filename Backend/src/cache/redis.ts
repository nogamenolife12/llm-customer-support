import { createClient } from "redis";
import { config } from "../../config/config.js";


const redisClient = createClient({
    url: config.redisUrl!,
});

redisClient.on("error",(err)=>{
    console.log("Redis Client Error",err);
})

redisClient.on("connect",()=>{
    console.log("Connecting to Redis");
});

redisClient.on("ready",()=>{
    console.log("Redis Client is ready");
});

export {redisClient}