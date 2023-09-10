import React, { useEffect } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { fetchChats } from '../../Helper/chat_api_helper';
import { AddIcon } from '@chakra-ui/icons';
import ListLoading from '../Loaders/ListLoading';
import { getReceiver } from '../../utils/chat';
import GroupChatModal from '../Modals/GroupChatModal';

const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
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
    fetchUserChats();
  }, []);
  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      h='88vh'
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily='Work sans'
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignContent='center'
      >
        My Chats
        <GroupChatModal>
          <Button
            display='flex'
            fontSize={{ base: '17px', md: '10px', lg: '12px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getReceiver(user, chat.users).name
                    : chat.name}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ListLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
