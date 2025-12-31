import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import PG from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
}

const pgPool = new PG.Pool({
    connectionString,
});

const adapter = new PrismaPg(pgPool);

declare global {
    // Prevent multiple instances of Prisma Client in development
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({adapter});

if(process.env.NODE_ENV !== "production"){
    global.prisma = prisma;
}
