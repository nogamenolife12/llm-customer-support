import dotenv from "dotenv";
import path from "path";

const isDev = process.env.NODE_ENV === 'development';

const envPath = isDev ? '.env.dev' : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envPath) });

 const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL,
};


export { config };