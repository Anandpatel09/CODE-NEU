import React,{useState,useRef, useEffect,} from 'react'
import toast from 'react-hot-toast';
import ACTIONS from '../Action';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import{Navigate, useLocation,useNavigate,useParams} from 'react-router-dom';


const EditorPage=()=> {

  const socketRef =useRef(null);
  const codeRef=useRef(null)
  const location=useLocation();
  const {roomId}=useParams();
  const reactNavigator=useNavigate();

  
  const [clients,setClients]=useState([]);



useEffect(() => {
  const init = async () => {
    socketRef.current = await initSocket(); // Initialize first

    // Now set event listeners
    socketRef.current.on('connect_error', (err) => handleErrors(err));
    socketRef.current.on('connect_failed', (err) => handleErrors(err));

    function handleErrors(e) {
      console.log('Socket error', e);
      toast.error('Socket connection failed, try again later');
      reactNavigator('/');
    }

    socketRef.current.emit(ACTIONS.JOIN, {
      roomId,
      username: location.state?.username,
    });
    //Listening for joined event
    socketRef.current.on(ACTIONS.JOINED,
      ({clients,username,socketId})=>{
           if(username !== location.state?.username){
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined the room.`);
           }
           setClients(clients);
           socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            socketId,
           });
    });

//Listening for disconnected

socketRef.current.on(
  ACTIONS.DISCONNECTED,
  ({socketId,username})=>{
    toast.success(`${username} left the room.`);
    setClients((prev)=>{
      return prev.filter(
        (client)=>client.socketId!==socketId
      )
    })
  }
)


  };
  init();
 
  return ()=>{
    socketRef.current.disconnect();
    socketRef.current.off(ACTIONS.JOINED);
    socketRef.current.off(ACTIONS.DISCONNECTED);
    
  };

}, []);




// useEffect(() => {
//   const init = async () => {
//       socketRef.current = await initSocket();

//       socketRef.current.on('connect_error', handleErrors);
//       socketRef.current.on('connect_failed', handleErrors);

//       function handleErrors(e) {
//           console.log('Socket error', e);
//           toast.error('Socket connection failed, try again later');
//           reactNavigator('/');
//       }

//       // Prevent duplicate joins
//       if (!clients.some(client => client.username === location.state?.username)) {
//           socketRef.current.emit(ACTIONS.JOIN, {
//               roomId,
//               username: location.state?.username,
//           });
//       }

//       socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//           if (username !== location.state?.username) {
//               toast.success(`${username} joined the room.`);
//               console.log(`${username} joined the room.`);
//           }

//           setClients((prevClients) => {
//             const updatedClients = [...prevClients, ...clients]; // Merge previous clients with new ones
//             const uniqueClients = [...new Map(updatedClients.map(client => [client.socketId, client])).values()];
//             return uniqueClients;
//         });
        
//       });
//   };
//   init();
// }, []);

async function copyRoomId(){
  try{
          await navigator.clipboard.writeText(roomId);
          toast.success('Room ID has been copied to your clipboard') 
  }catch(err){
        toast.error('Could not copy the room Id');
        console.error(err);
  }
}




function leaveRoom(){
  reactNavigator('/');

}


  if(!location.state){
    return<Navigate to="/"  />
  }

  return (
    <div className='mainWrap'>
      <div className='aside'>
       <div className='asideInner'>
        <div className='logo'>
          {/* <img className='logoImage' src="null" alt="code neu" /> */}
          <h2>CODE NEU</h2>
        </div>
        <h3>Connected</h3>
        <div className='clientsList'>
          {clients.map((client)=>(<Client key={client.socketId} username={client.username}/>))}
        </div>
       </div>
       <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
       <button className='btn leaveBtn'onClick={leaveRoom}>Leave</button>
      </div>

      <div className='editorWrape'>
         <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}}/>
      </div>
    </div>
  )
}

export default EditorPage;
   