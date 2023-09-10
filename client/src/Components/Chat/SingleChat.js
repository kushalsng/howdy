import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons';
import { getReceiver } from '../../utils/chat';
import ProfileModal from '../Modals/ProfileModal';
import GroupChatModal from '../Modals/GroupChatModal';
import { getChatMessages, sendMessage } from '../../Helper/message_api_helper';
import ScrollableChat from './ScrollableChat';

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await getChatMessages(selectedChat._id);
      setLoading(false);
      setMessages(data.messages);
    } catch (err) {
      console.error('error while fetching messages: ', err);
      toast({
        title: 'Unable to fetch messages!',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    }
  };

  const sendMessageHandler = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        setNewMessage('');
        const { data } = await sendMessage({
          chatId: selectedChat._id,
          content: newMessage,
        });
        setMessages([...messages, data.message]);
      } catch (err) {
        console.error('error while sending message: ', err);
        toast({
          title: 'Unable to send message',
          description: err.response.data.msg,
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom',
          variant: 'left-accent',
        });
      }
    }
  };
  const typingHandler = async (e) => {
    setNewMessage(e.target.value);

    // Typing logic
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);
  return (
    <React.Fragment>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            py={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getReceiver(user, selectedChat.users).name}
                <ProfileModal user={getReceiver(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.name.toUpperCase()}
                <GroupChatModal isUpdate={true}>
                  <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} />
                </GroupChatModal>
              </>
            )}
          </Text>
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='hidden'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessageHandler} isRequired mt={3}>
              <Input
                variant='filled'
                bg='#E8E8E8'
                placeholder='Write a message...'
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          h='100%'
        >
          <Text fontSize='3xl' pb={3} fontFamily='Work sans' textAlign='center'>
            Start a conversation <br />
            Send a friendly 'Howdy' 👋🏻 to kick things off.
          </Text>
        </Box>
      )}
    </React.Fragment>
  );
};

export default SingleChat;
