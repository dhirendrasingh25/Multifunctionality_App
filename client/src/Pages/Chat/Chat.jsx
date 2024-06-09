import { useGetMessageQuery, useGetProfileQuery, useSendMessageMutation } from '@/RTK/api';
import React, { useState, useMemo, useEffect ,useRef} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { server } from '../../main';
import { Loader } from '@/components/Loader';


const Chat = () => {
  const  id  = useParams();
  const { data: getProfile } = useGetProfileQuery(id);
  const { user } = useSelector((state) => state.auth);
  // console.log(id.id);
  const {data:Allmessages , isLoading} = useGetMessageQuery({rid:user?._id,sid:id.id});

  
  // console.log(Allmessages);
  
  // console.log(getProfile?.user);

  const [sendMessage] = useSendMessageMutation();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState('');
  useEffect(() => {
    if (Allmessages) {
      setMessages(Allmessages);
    }
  }, [Allmessages]);
  const socket = useMemo(() => io(`${server}`, {
    query: { userId: user?._id },
  }), [user?._id]);

  useEffect(() => {
    socket.on('connect', () => {
      // console.log('Connected', socket.id);
      setSocketId(socket.id);
    });

    socket.on("newMessage",(data)=>{
      // console.log(data);
      setMessages((messages)=>[...messages,data])
    })
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // console.log(user?._id);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const data = { message, sender: user._id };
    await sendMessage({ id, data });
    socket.emit("newMessage", message);
    // console.log(message);
    setMessage('');
  };
  // console.log(messages);

  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the messages container
  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if(isLoading) return <Loader/>
  return (
    <div className='flex justify-between flex-col h-full'>
      <div className='text-center text-xl font-medium border p-2 rounded-lg'>
        User: {getProfile?.user?.name}
        <p>Location: {getProfile?.user?.location}, Email: {getProfile?.user?.email}</p>
      </div>
      <div>
        <div className='h-[558px] rounded-lg my-2 overflow-y-scroll'>
          {messages.map((msg, index) => (
            <div key={index} className={`m-2 ${msg.sender == user._id ? 'flex flex-row-reverse sm:ml-72 ml-12' : ''}`}>
              <div className='py-2 px-4 w-fit bg-slate-100 rounded-lg'>
                <strong>{msg.sender == user._id ? 'You' : getProfile?.user?.name}</strong>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div  >
        <div className='w-full p-2 flex border rounded-lg flex-row space-x-4'>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type='text'
            placeholder='Type a message'
            className='p-2 outline-none w-full'
          />
          <button onClick={handleSendMessage} type='submit' className='bg-blue-500 hover:bg-blue-300 text-white px-6 py-1 rounded-lg'>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
