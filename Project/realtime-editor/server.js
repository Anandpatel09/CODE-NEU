// const express =require('express')
// const app = express();
// const http = require('http');
// const{Server}= require('socket.io');

// const server =http.createServer(app);
// const io =new Server(server);

// io.on('connected',(socket)=>{
//     console.log('socket connected',socket.id)
// })
// const PORT=process.env.PORT ||5000;
// server.listen(PORT,()=>console.log(`Listening on port ${PORT}`));


const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const ACTIONS = require('./src/Action');
const path = require('path');



app.use(cors()); // Enable CORS for all requests

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // React frontend URL
        methods: ["GET", "POST"]
    }
});


app.use(express.static('build')); // for production build.


app.use((req,res,next)=>{//middlewear
    res.sendFile(path.join(__dirname,'build','index.html'));
})

const userSocketMap={};

function getAllConnectedClients(roomId){
    //map
     return Array.from(io.sockets.adapter.rooms.get(roomId)||[]).map(
        (socketId)=>{
        return{
            socketId,
            username:userSocketMap[socketId],
        }
     });
}

io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
    });

    socket.on(ACTIONS.JOIN,({roomId,username})=>{
       userSocketMap[socket.id]=username;
       socket.join(roomId);
       const clients=getAllConnectedClients(roomId);
       clients.forEach(({socketId})=>{
        io.to(socketId).emit(ACTIONS.JOINED,{
            clients,
            username,
            socketId:socket.id,
        });
       });
    });



socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
});


socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
    io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
});



    socket.on('disconnecting', ()=>{
        const rooms=[...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
