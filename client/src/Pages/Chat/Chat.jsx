import { useGetProfileQuery } from '@/RTK/api'
import React ,{useState} from 'react'
import { get } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { set } from 'zod'


const Chat = () => {
  const id = useParams()
  const { data:getProfile} = useGetProfileQuery(id)
  const {user} = useSelector((state)=>state.auth)

  console.log(getProfile?.user);
  const [message, setMessage] = useState("");
  // console.log(id)
  const handleSendMessage = () => {
    console.log(message);
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
              <p>Hello bacchi</p>
          </div>
        </div>
        <div className='m-2 flex flex-row-reverse  ml-72'>
          <div className='py-2 px-4 w-fit bg-slate-100 rounded-lg'>
              <strong>You</strong>
              <p>Hii Bantai</p>
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
