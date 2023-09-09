import React, { useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import Header from '../Components/Chat/Header';
import MyChats from '../Components/Chat/MyChats';
import ChatBox from '../Components/Chat/ChatBox';

const ChatPage = () => {
  const { user } = ChatState();
  const [fetch, setFetch] = useState(false)
  return (
    <div style={{ width: '100%' }}>
      {user && <Header />}
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        h='91vh'
        p='10px'
      >
        {user && <MyChats fetch={fetch} />}
        {user && <ChatBox fetch={fetch} setFetch={setFetch} />}
      </Box>
    </div>
  );
};

export default ChatPage;
