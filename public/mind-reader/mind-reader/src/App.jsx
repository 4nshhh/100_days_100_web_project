
import './App.css'
import  characters  from "./data-set/characters.json";
import findchar from './utils/gameEngine.js'
import questions from "./data-set/questions.json"
import { useState } from 'react';


function App() {
  let [curQue,setque]=useState(0);
  let [remainingchar,setremainingchar]=useState(characters);
  let [ans,setans]=useState('');
  return (
    
 
  <div className="background">
    <h1 className='main-title'>AKINATOR</h1>
  <div className="card">
    <p className='question'>{questions[curQue].question}</p>

<div className="btn-box">
    <button className='btn' onClick={()=>{
      if(remainingchar.length != 1){
        setque(curQue+1);
      setremainingchar(findchar(true,questions[curQue].key,remainingchar))
      console.log(remainingchar)
      }else{
       setans(ans = remainingchar[0].name);
        
      
      }
      
 }}>yes</button>
    <button className='btn' onClick={()=>{
       if(remainingchar.length != 1){
        setque(curQue+1);
      setremainingchar(findchar(false,questions[curQue].key,remainingchar))
      console.log(remainingchar)
       }else{
        setans(ans=remainingchar[0].name);
        
      }
      
    }}>no</button>

  </div>
    
    <p>your answer is {ans}</p>

  </div>

  </div>

  )
}

export default App
