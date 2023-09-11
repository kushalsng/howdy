import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    if(!userData){
      navigate('/');
    }
  }, [])
  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications}}>
      {children}
    </ChatContext.Provider>
  )
}
export const ChatState = () => {
  return useContext(ChatContext);
}


export default ChatProvider