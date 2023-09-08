import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/Chat/SideDrawer';
import MyChats from '../Components/Chat/MyChats';
import ChatBox from '../Components/Chat/ChatBox';

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%"}}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        h="91vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  )
}

export default ChatPage