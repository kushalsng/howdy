import React, { useEffect, useRef, useState } from 'react';
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
import '../../assets/styles/styles.css';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../../assets/animations/typing.json';
const ENDPOINT = 'https://howdy-rvua.onrender.com';
// const ENDPOINT = 'http://localhost:5000';
let socket, selectedChatCompare;

const SingleChat = () => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
    chats,
    setChats,
  } = ChatState();
  const messageBoxRef = useRef(null);
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await getChatMessages(selectedChat._id);
      setMessages(data.messages);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
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
      socket.emit('stop typing', selectedChat._id);
      try {
        setNewMessage('');
        const { data } = await sendMessage({
          chatId: selectedChat._id,
          content: newMessage,
        });
        socket.emit('new message', data.message);
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
    if (!isSocketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit('setup', user);
      socket.on('connected', () => setSocketConnected(true));
      socket.on('typing', () => setIsTyping(true));
      socket.on('stop typing', () => setIsTyping(false));
    }
  }, [user]);
  useEffect(() => {
    fetchMessages();
    setNewMessage('');
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (receivedMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== receivedMessage.chat._id
      ) {
        if (notifications && !notifications.includes(receivedMessage)) {
          const receivedMsgChat = receivedMessage.chat;
          const foundChat = notifications.find(
            (notif) => notif._id === receivedMsgChat._id
          );
          if (foundChat) {
            foundChat.count++;
            setNotifications([...notifications]);
          } else {
            receivedMsgChat.count = 1;
            setNotifications([receivedMsgChat, ...notifications]);
          }
        }
      } else {
                setMessages([...messages, receivedMessage]);
      }
    });
  });
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
              <div className='messages' ref={messageBoxRef}>
                <ScrollableChat messages={messages} messageBoxRef={messageBoxRef} />
              </div>
            )}
            <FormControl onKeyDown={sendMessageHandler} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: animationData,
                      rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice',
                      },
                    }}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant='filled'
                bg='#E8E8E8'
                placeholder='Write a message...'
                onChange={typingHandler}
                value={newMessage}
                border={{ base: '0.5px solid lightgrey' }}
                _focus={{ borderWidth: '2px' }}
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
