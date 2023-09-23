import React, { useEffect, useRef, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import {
  Avatar,
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
import typingAnimationData from '../../assets/animations/typing.json';
import audioRecordingAnimationData from '../../assets/animations/audio-recording2.json';
import ReplyCard from '../Message/ReplyCard';
import AudioCard from '../Message/AudioCard';
import { RiSendPlane2Fill, RiMicFill, RiDeleteBin5Fill } from 'react-icons/ri';
import { FaRegSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { uploadToCloudinary } from '../../utils/cloudinary';

let socket, selectedChatCompare;

const SingleChat = () => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const messageBoxRef = useRef(null);
  const inputBoxRef = useRef(null);
  const toast = useToast();
  const receiver =
    user && selectedChat ? getReceiver(user, selectedChat.users) : {};
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyOfMessage, setReplyOfMessage] = useState(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isDiscardAudio, setIsDiscardAudio] = useState(false);
  const [audioMediaRecorder, setAudioMediaRecorder] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const escapeKeyHandler = (e) => {
    if (e.key === 'Escape') {
      setIsEmojiPickerOpen(false);
      clearAudioRecording();
      inputBoxRef.current.focus();
    }
  };
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

  const sendTextMessageHandler = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        setNewMessage('');
        setIsEmojiPickerOpen(false);
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
  const sendAudioRecording = async (mediaUrl) => {
    if (!mediaUrl) return;
    try {
      const params = {
        chatId: selectedChat._id,
        mediaUrl,
        type: 'audio',
      };
      const { data } = await sendMessage(params);
      setMessages([...messages, data.message]);
    } catch (err) {
      console.error('error while sending audio: ', err);
      toast({
        title: 'Unable to send audio',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
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

  const onRecordAudio = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: `Your browser doesn't support audio recording!`,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      return;
    }
    setIsEmojiPickerOpen(false);
    try {
      if (!audioMediaRecorder) {
        const blob = [];
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setIsRecordingAudio(true);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        mediaRecorder.ondataavailable = (e) => {
          blob.push(e.data);
        };
        mediaRecorder.onstop = () => {
          if (isDiscardAudio) {
            clearAudioRecording();
            setIsDiscardAudio(false);
          } else {
            onStopRecordAudio(blob);
          }
        };
        setAudioMediaRecorder(mediaRecorder);
      } else {
        audioMediaRecorder.stop();
      }
    } catch (err) {
      toast({
        title: `Permission denied to record audio!`,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    }
  };
  const onStopRecordAudio = async (blob) => {
    setIsEmojiPickerOpen(false);
    clearAudioRecording();
    const audioBlob = new Blob(blob, { type: 'audio/mp3' });
    const mediaUrl = await uploadToCloudinary(audioBlob, 'audio');
    sendAudioRecording(mediaUrl);
  };
  const clearAudioRecording = () => {
    setAudioMediaRecorder(null);
    setIsRecordingAudio(false);
  };
  const clearAudioFile = () => {
    setAudioFile(null);
  };
  useEffect(() => {
    if (isDiscardAudio) {
      clearAudioRecording();
      setIsDiscardAudio(false);
    }
  }, [isDiscardAudio]);
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
    fetchMessages();
    setNewMessage('');
    setIsEmojiPickerOpen(false);
    setReplyOfMessage(null);
    clearAudioRecording();
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
                <div style={{ cursor: 'pointer' }}>
                  <ProfileModal user={receiver}>
                    <Avatar
                      size='md'
                      color='black'
                      cursor='pointer'
                      name={receiver.name}
                      src={receiver.userPic}
                      mx={2}
                    />
                    {receiver.name}
                  </ProfileModal>
                </div>
                <ProfileModal user={receiver} />
              </>
            ) : (
              <>
                <GroupChatModal isUpdate={true}>
                  <Avatar
                    size='md'
                    color='black'
                    cursor='pointer'
                    name={selectedChat.name}
                    src={selectedChat.groupPic}
                    mx={2}
                  />
                  <span
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    {selectedChat.name.toUpperCase()}
                  </span>
                </GroupChatModal>
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
              <div
                className='messages'
                onClick={() => setIsEmojiPickerOpen(false)}
                ref={messageBoxRef}
              >
                <ScrollableChat
                  messages={messages}
                  messageBoxRef={messageBoxRef}
                  inputBoxRef={inputBoxRef}
                  setReplyOfMessage={setReplyOfMessage}
                  isTyping={isTyping}
                  isAtBottom={isAtBottom}
                  setIsAtBottom={setIsAtBottom}
                />
              </div>
            )}
            <FormControl
              onKeyDown={(e) => {
                sendTextMessageHandler(e);
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
                      animationData: typingAnimationData,
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

                {audioFile && (
                  <AudioCard
                    audioFile={audioFile}
                    clearAudioFile={clearAudioFile}
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
                    pe={isRecordingAudio ? '6rem' : '2.8rem'}
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
                      setIsEmojiPickerOpen(!isEmojiPickerOpen);
                    }}
                  >
                    <FaRegSmile />
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      right: isRecordingAudio ? 40 : 63,
                      top: isRecordingAudio ? -24 : 0,
                      bottom: isRecordingAudio ? -24 : 0,
                      fontSize: 25,
                      color: '#262626',
                      padding: '0.5rem 0.7rem',
                      display: 'flex',
                      gap: '0.5rem',
                    }}
                  >
                    <RiDeleteBin5Fill
                      fill='#ff4242'
                      style={{
                        display: isRecordingAudio ? 'block' : 'none',
                        marginTop: '1.4rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setIsDiscardAudio(true);
                      }}
                    />
                    <div
                      onClick={onRecordAudio}
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      {isRecordingAudio ? (
                        <Lottie
                          options={{
                            loop: true,
                            autoplay: true,
                            animationData: audioRecordingAnimationData,
                            rendererSettings: {
                              preserveAspectRatio: 'xMidYMid slice',
                            },
                          }}
                          width={70}
                          style={{
                            marginBottom: 15,
                            marginLeft: 0,
                          }}
                        />
                      ) : (
                        <RiMicFill />
                      )}
                    </div>
                  </span>
                  {isEmojiPickerOpen && (
                    <span
                      style={{
                        position: 'absolute',
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
                  )}
                  <Button
                    background='transparent'
                    ms='1rem'
                    onClick={sendTextMessageHandler}
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
