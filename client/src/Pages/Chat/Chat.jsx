import { useGetProfileQuery } from '@/RTK/api'
import React ,{useState} from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { io } from "socket.io-client";
import { useMemo ,useEffect } from 'react';
import {server} from '.././../main'


const Chat = () => {
  const id = useParams()
  const { data:getProfile} = useGetProfileQuery(id)
  const {user} = useSelector((state)=>state.auth)
  console.log(getProfile?.user);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])
  const [socketId, setsocketId] = useState("")
  console.log(id)

  const socket = useMemo(() => io(`${server}`,{
    
  }), []);

  useEffect(() => {
    socket.on("connect",()=>{
      console.log("Connected" ,socket.id);
      setsocketId(socket.id)
    })
    socket.on("message",(data)=>{
      console.log(data);
      setMessages((messages)=>[...messages,data])
    })
    return ()=>{
      socket.disconnect()
    }
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    socket.emit("message", {chatId:"UBIUNOU",message,members:{sender:user?._id,receiver:id}});
    setMessage("");
  }
  return (

    <div className='flex justify-between flex-col h-full '>
      <div className='text-center text-xl font-medium border p-2 rounded-lg'>
        User : {getProfile?.user?.name} 
        <p>Location: {getProfile?.user?.location} , Email: {getProfile?.user?.email}</p>
      </div>
      <div>
      <div className='h-[558px] rounded-lg my-2 overflow-y-scroll '>
        <div className='m-2 max-w-[75%]  '>
          <div className='py-2 px-4 w-fit bg-slate-100 rounded-lg'>
              <strong>{getProfile?.user?.name}</strong>
              <p>Hello </p>
          </div>
        </div>
        <div className='m-2 flex flex-row-reverse sm:ml-72 ml-12'>
          <div className='py-2 px-4 w-fit bg-slate-100 rounded-lg'>
              <strong>You</strong>
              <p>Hii</p>
          </div>
        </div>
      </div>
      <div className='w-full p-2 flex border rounded-lg flex-row space-x-4'>
      <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder='Type a message ' className='p-2 outline-none  w-full'/>
      <button onClick={handleSendMessage} type='submit' className='bg-blue-500 hover:bg-blue-300 text-white px-6 py-1 rounded-lg'>Send</button>
      </div>
      </div>
    </div>

  )
}

export default Chat
