import React, { useEffect, useRef, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { DateTime } from 'luxon';
import '../../assets/styles/styles.css';
import { isLastMessage, isSameSender, isSameUser } from '../../utils/chat';
import { Avatar, Box } from '@chakra-ui/react';
import { RiReplyFill } from 'react-icons/ri';
import ReplyCard from './ReplyCard';
import ProfileModal from '../Modals/ProfileModal';
import { avatarWidth, replyIconWidth } from '../../Constants/message';
import AudioCard from './AudioCard';

const Message = ({
  message,
  messages,
  index,
  messageBoxRef,
  inputBoxRef,
  setReplyOfMessage,
}) => {
  const { user, selectedChat } = ChatState();
  const isMyMessage = Boolean(message.sender._id === user._id);
  const messageRef = useRef(null);

  const [isHoveringMessage, setIsHoveringMessage] = useState(false);
  const [marginLeft, setMarginLeft] = useState(0);

  const handleResize = () => {
    if (isMyMessage) {
      const messageWidth = messageRef.current.offsetWidth + 5;
      const boxWidth = messageBoxRef.current.offsetWidth;
      const margin = boxWidth - messageWidth;
      setMarginLeft(margin);
    } else if (
      !(
        isSameSender(messages, message, index, user._id) ||
        isLastMessage(messages, index, user._id)
      ) &&
      selectedChat.isGroupChat
    ) {
      setMarginLeft(avatarWidth);
    } else {
      setMarginLeft(0);
    }
  };
  const getMarginLeft = () => {
    return !isHoveringMessage
      ? marginLeft
      : isMyMessage ||
        isSameSender(messages, message, index, user._id) ||
        isLastMessage(messages, index, user._id)
      ? 0
      : !selectedChat.isGroupChat
      ? 0
      : avatarWidth;
  };
  const getMarginTop = () => {
    return isSameUser(messages, message, index, user._id)
      ? 3
      : !isSameUser(messages, message, index, user._id) &&
        message.sender._id !== user._id &&
        message.chat.isGroupChat
      ? 0
      : 10;
  };
  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [messages]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => setIsHoveringMessage(true)}
      onMouseLeave={() => setIsHoveringMessage(false)}
    >
      {(isSameSender(messages, message, index, user._id) ||
        isLastMessage(messages, index, user._id)) &&
        selectedChat.isGroupChat && (
          <ProfileModal user={message.sender}>
            <Avatar
              mt='7px'
              mr='1'
              size='sm'
              cursor='pointer'
              title={message.chat.isGroupChat ? message.sender.name : ''}
              name={message.sender.name}
              src={message.sender.userPic}
            />
          </ProfileModal>
        )}
      {isHoveringMessage && (
        <span
          style={{
            padding: '0 5px',
            cursor: 'pointer',
            marginLeft: marginLeft - replyIconWidth,
            display: !isMyMessage ? 'none' : 'inline',
          }}
          onClick={() => {
            setReplyOfMessage(message);
            inputBoxRef.current.focus();
          }}
        >
          <RiReplyFill />
        </span>
      )}
      {message.type === 'audio' ? (
        <AudioCard
          messageRef={messageRef}
          message={message}
          audioUrl={message.mediaUrl}
          getMarginTop={getMarginTop}
          getMarginLeft={getMarginLeft}
        />
      ) : (
        <span
          ref={messageRef}
          style={{
            backgroundColor: isMyMessage ? '#BEE3F8' : '#B9F5D0',
            borderRadius: '20px',
            padding: '5px 15px',
            maxWidth: '75%',
            marginLeft: getMarginLeft(),
            marginTop: getMarginTop(),
            width: message.replyOfMessage?.type === 'audio' ? '50%' : '',
          }}
        >
          {message.replyOfMessage && (
            <ReplyCard
              message={message.replyOfMessage}
              messageOfReply={message}
            />
          )}
          <Box>
            <span>{message.content}</span>
            <span
              style={{
                fontSize: '0.65rem',
                color: '#595959',
                float: 'right',
                margin: '10px 0px 0px 5px',
              }}
            >
              {DateTime.fromISO(message.updatedAt).toFormat('T')}
            </span>
          </Box>
        </span>
      )}

      {isHoveringMessage && (
        <span
          style={{
            padding: '5px 5px',
            cursor: 'pointer',
            display: isMyMessage ? 'none' : 'inline',
          }}
          onClick={() => {
            setReplyOfMessage(message);
            inputBoxRef.current.focus();
          }}
        >
          <RiReplyFill />
        </span>
      )}
    </div>
  );
};

export default Message;
