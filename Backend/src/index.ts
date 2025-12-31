import 'dotenv/config';
import { app } from "./server.js";
import { AppError } from './utils/appError.js';

const PORT = process.env.PORT || 3000;

app.use((err: any, req: any, res: any, next: any) => {
    console.log(err);

    if (err.type === 'entity.too.large') {
        return res.status(413).json({ 
            error: "The message is way too large for the server to process." 
        });
    }
    
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    return res.status(500).json({
        error: 'Internal Server Error'
    });
});

app.get("/health", (req, res) => res.status(200).send("OK"));

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

