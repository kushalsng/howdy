import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, useToast } from '@chakra-ui/react';
import Header from '../Components/Chat/Header';
import MyChats from '../Components/Chat/MyChats';
import ChatBox from '../Components/Chat/ChatBox';
import { fetchChats } from '../Helper/chat_api_helper';

const ChatPage = () => {
  const { user, setChats } = ChatState();
  const toast = useToast();

  const fetchUserChats = async () => {
    try {
      const { data } = await fetchChats();
      setChats(data.chats);
    } catch (err) {
      console.error('error while fetching chats: ', err);
      toast({
        title: 'Unable to get your chats!',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    }
  };
  useEffect(() => {
    if(user){
      fetchUserChats();
    }
  }, [user]);
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
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
