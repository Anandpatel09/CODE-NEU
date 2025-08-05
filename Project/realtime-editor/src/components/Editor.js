// import React, { useEffect } from 'react'
// import Codemirror from 'codemirror';
// import "codemirror/lib/codemirror.css"; // Import default CodeMirror styles
// import "codemirror/theme/dracula.css";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import 'codemirror/mode/javascript/javascript';


// const Editor=()=> {
 

//     useEffect(()=>{
//         async function init(){
//           // Ensure it's empty before initializing
//             Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
//                 mode:{name:'javascript',json:true},
//                 theme:'dracula',
//                 autoCloseTags:true,
//                 autoCloseBrackets:true,
//                 lineNumbers:true,
//             });
//         }
//          init();
//     },[]);

//   return (
//     <>
//     <textarea name="" id="realtimeEditor"></textarea>
//     </>
//   )
// }

// export default Editor






import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import "codemirror/lib/codemirror.css"; 
// Import default CodeMirror styles
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import 'codemirror/mode/javascript/javascript';
import ACTIONS from '../Action';

const Editor = ({socketRef,roomId,onCodeChange}) => {
    

    



    const editorRef = useRef(null); // Reference to store CodeMirror instance

    useEffect(() => {
        if (!editorRef.current) {
            const textarea = document.getElementById('realtimeEditor');
            textarea.value = ""; // Clear any default text
            
            editorRef.current = Codemirror.fromTextArea(textarea, {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });



            editorRef.current.on('change',(instance,changes)=>{
                // console.log('changes',changes);
                const {origin}=changes;
                const code=instance.getValue();
                onCodeChange(code);
                if(origin !=='setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                        roomId,
                        code,
                    });
                }
                console.log(code);

            })
             
            
          
        }
        
    }, []);

    useEffect(()=>{
if(socketRef.current){
    socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        if(code !==null){
              editorRef.current.setValue(code);
        }
     })
}
        
return()=>{
    socketRef.current.off(ACTIONS.CODE_CHANGE);
};

    },[socketRef.current]);




    return (
        <>
            <textarea id="realtimeEditor"></textarea>
        </>
    );
};

export default Editor;
