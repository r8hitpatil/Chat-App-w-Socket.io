import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
// Create server and make a cors policy to interact with frontend
const io = new Server(server, {
    cors : {
        origin : "http://localhost:5173"
    }
});

const port = 8000;

// http request cors policy frontend
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

io.on('connection',(socket) => {
    // console.log(`User connection with id ${socket.id}`)
    socket.on('message',(msg) => {
        console.log(`User ${socket.id} sent message : ${msg}`);
        socket.broadcast.emit('message',{
            text : msg,
            user : socket.id,
            timestamp : new Date()
            // no type here cuz server dunno yet what it is
        }); // why not io.broadcast.emit
    });
});

app.get('/', (req, res) => {
    res.send('Starting Socket.IO');
});

server.listen((port),() => {
    console.log(`Connection established at port ${port}`);
});