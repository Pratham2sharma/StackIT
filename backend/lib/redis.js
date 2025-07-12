import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URI,
        port: process.env.REDIS_PORT,
    }
    
});

client.on('error', (err) => console.error('❌ Redis Error:', err));

// Connect only once when the file is imported
await client.connect();
console.log('✅ Redis connected');



export default client;
 

