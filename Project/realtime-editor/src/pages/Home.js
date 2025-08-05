import React, { useState } from 'react'
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';


const Home=()=> {

const navigate=useNavigate();
const [roomId,setRoomId]=useState('');
const [username,setUsername]=useState('');



const createNewRoom=(e)=>{
  e.preventDefault();
  const id =uuidV4();
  setRoomId(id);
  toast.success('Created a new room');
};


const joinRoom=()=>{
  if(!roomId || !username){
    toast.error('ROOM ID & username is required');
    return;
  }
  //Redirect
  navigate(`/editor/${roomId}`,{
    state:{
      username,
    },
  });
};

const handleInputeEnter =(e)=>{
  if(e.code === 'Enter'){
    joinRoom();
  }
};


  return (
    <div className='homePageWrapper'>
     <div className='formWrapper'> 
        <img className='homePageLogo' src="null" alt="Code-neu-logo"/>
        <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
        <div className='inputGroup'>
           <input type="text"
            className='inputBox'
            placeholder='ROOM ID'
            onChange={(e)=>setRoomId(e.target.value)} 
            value={roomId} 
            onKeyUp={handleInputeEnter} 
              />

           <input type="text" 
           className='inputBox' 
           placeholder='User' 
           onChange={(e)=>setUsername(e.target.value)} 
           value={username}
           onKeyUp={handleInputeEnter} 

           />

           <button  className='btn joinBtn' onClick={joinRoom}>JOIN</button>

           <span className='createInfo'>
            If you don't have an invite then create &nbsp;
           </span>
           <a onClick={createNewRoom} href="" className='createNewBtn'>new room</a>
        </div>
     </div>
    <footer>
        <h4>Build with 💛&nbsp; by {' '} 
            <a href="https://github.com/Anandpatel09"> Anand Patel</a>
            
        </h4>
    </footer>
    </div>
  )
}

export default Home
