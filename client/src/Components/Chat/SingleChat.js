import React, { useEffect, useRef, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import {
  Box,
  Button,
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
import ReplyCard from '../Message/ReplyCard';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { FaRegSmile } from 'react-icons/fa';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import { messageCountLimit } from '../../Constants/message';

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

  const inputBoxRef = useRef(null);
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [totalMessagesCount, setTotalMessagesCount] = useState(0);
  const [fetchedMessageCount, setFetchedMessageCount] = useState(0);
  const [fetchingChat, setFetchingChat] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyOfMessage, setReplyOfMessage] = useState(null);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAtTop, setIsAtTop] = useState(false);

  const escapeKeyHandler = (e) => {
    if (e.key === 'Escape') {
      setIsOpenEmojiPicker(false);
      inputBoxRef.current.focus();
    }
  };
  const fetchMessages = async (skip, limit) => {
    if (!selectedChat) return;
    try {
      setFetchingChat(true);
      setFetchingMessages(true);
      const { data } = await getChatMessages(selectedChat._id, skip, limit);
      setMessages([...messages, ...data.messages]);
      setFetchedMessageCount((prevCount) => prevCount + data.messages.length);
      setTotalMessagesCount(data.totalMessagesCount);
      setFetchingMessages(false);
      setFetchingChat(false);

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
    if ((e.key === 'Enter' || e.type === 'click') && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        setNewMessage('');
        setIsOpenEmojiPicker(false);
        const params = {
          chatId: selectedChat._id,
          content: newMessage,
        };
        if (replyOfMessage) {
          params.replyOfMessageId = replyOfMessage._id;
        }
        const { data } = await sendMessage(params);
        socket.emit('new message', data.message);
        setReplyOfMessage(null);
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
      socket = io(process.env.REACT_APP_BASE_URL);
      socket.emit('setup', user);
      socket.on('connected', () => setSocketConnected(true));
      socket.on('typing', () => setIsTyping(true));
      socket.on('stop typing', () => setIsTyping(false));
    }
  }, [user]);
  useEffect(() => {
    fetchMessages(0, messageCountLimit);
    setNewMessage('');
    setIsOpenEmojiPicker(false);
    setReplyOfMessage(null);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    if (
      isAtTop &&
      fetchedMessageCount >= messageCountLimit &&
      fetchedMessageCount < totalMessagesCount
    ) {
      fetchMessages(fetchedMessageCount, messageCountLimit);
    }
  }, [isAtTop]);

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
            {fetchingChat ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <ScrollableChat
                messages={messages}
                inputBoxRef={inputBoxRef}
                setReplyOfMessage={setReplyOfMessage}
                isTyping={isTyping}
                isAtBottom={isAtBottom}
                setIsAtBottom={setIsAtBottom}
                setIsAtTop={setIsAtTop}
                setIsOpenEmojiPicker={setIsOpenEmojiPicker}
                fetchingMessages={fetchingMessages}
              />
            )}
            <FormControl
              onKeyDown={(e) => {
                sendMessageHandler(e);
                escapeKeyHandler(e);
              }}
              isRequired
              mt={replyOfMessage ? 0 : 3}
              position='relative'
            >
              {isTyping ? (
                <div
                  style={{
                    position: isAtBottom ? 'static' : 'absolute',
                    background: 'none',
                    bottom: !replyOfMessage ? '2rem' : '5rem',
                  }}
                >
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

              <div>
                {replyOfMessage && (
                  <ReplyCard
                    message={replyOfMessage}
                    setReplyOfMessage={setReplyOfMessage}
                  />
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Input
                    ref={inputBoxRef}
                    variant='filled'
                    ps='2.8rem'
                    bg='#E8E8E8'
                    placeholder='Write a message...'
                    onChange={typingHandler}
                    value={newMessage}
                    border={{ base: '0.5px solid lightgrey' }}
                    _focus={{ borderWidth: '2px' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: 25,
                      color: '#262626',
                      padding: '0.5rem 0.7rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setIsOpenEmojiPicker(!isOpenEmojiPicker);
                    }}
                  >
                    <FaRegSmile />
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      display: isOpenEmojiPicker ? 'block' : 'none',
                      bottom: '3rem',
                    }}
                  >
                    <EmojiPicker
                      autoFocusSearch={false}
                      onEmojiClick={(e) =>
                        setNewMessage((prevMessage) => prevMessage + e.emoji)
                      }
                    />
                  </span>
                  <Button
                    background='transparent'
                    ms='1rem'
                    onClick={sendMessageHandler}
                  >
                    <RiSendPlane2Fill />
                  </Button>
                </div>
              </div>
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
