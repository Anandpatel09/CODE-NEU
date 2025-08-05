// import{io} from 'socket.io-client';

// export const initSocket = async ()=>{
//     const options ={
//         'force new connection': true,
//         reconnectionAttempt:'Infinity',
//         timeout:10000,
//         transports:[websocket],
//     };

//     return io(process.env.REACT_APP_BACKEND_URL,options);
// };

import { io } from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // Fallback in case env is missing

export const initSocket = async () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ["websocket"], 
    };

    console.log("  Connecting to WebSocket at:", BACKEND_URL);
    return io(BACKEND_URL, options);
};
