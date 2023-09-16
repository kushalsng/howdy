import React, { useEffect, useRef, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { DateTime } from 'luxon';
import '../../assets/styles/styles.css';
import {
  isLastMessage,
  isSameSender,
  isSameUser,
} from '../../utils/chat';
import { Avatar, Box } from '@chakra-ui/react';
import { RiReplyFill } from 'react-icons/ri';

const Message = ({ message, messages, index, messageBoxRef, setReplyOfMessage }) => {
  const replyIconWidth = 26;
  const { user } = ChatState();
  const ref = useRef(null);
  const [isHoveringMessage, setIsHoveringMessage] = useState(false);
  const [marginLeft, setMarginLeft] = useState(0);
  const handleResize = () => {
    if (message.sender._id === user._id) {
      const messageWidth = ref.current.offsetWidth + 5;
      const boxWidth = messageBoxRef.current.offsetWidth;
      const margin = boxWidth - messageWidth;
      console.log(messageWidth, margin);
      setMarginLeft(margin);
    } else {
      setMarginLeft(0);
    }
  };
  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div
      className='message'
      onMouseEnter={() => setIsHoveringMessage(true)}
      onMouseLeave={() => setIsHoveringMessage(false)}
      onClick={() => setReplyOfMessage(message)}
    >
      {(isSameSender(messages, message, index, user._id) ||
        isLastMessage(messages, index, user._id)) && (
        <Avatar
          mt='7px'
          mr='1'
          size='sm'
          cursor='pointer'
          title={message.chat.isGroupChat ? message.sender.name : ''}
          name={message.sender.name}
          src={message.sender.userPic}
        />
      )}
      {isHoveringMessage && (
        <span
          style={{
            padding: '0 5px',
            cursor: 'pointer',
            marginLeft: marginLeft - replyIconWidth,
            display: message.sender._id !== user._id ? 'none' : 'inline',
          }}
        >
          <RiReplyFill />
        </span>
      )}
      <span
        ref={ref}
        style={{
          backgroundColor:
            message.sender._id === user._id ? '#BEE3F8' : '#B9F5D0',
          borderRadius: '20px',
          padding: '5px 15px',
          maxWidth: '75%',
          marginLeft: isHoveringMessage ? 0 : marginLeft,
          marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,
        }}
      >
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

      {isHoveringMessage && (
        <span
          style={{
            padding: '5px 5px',
            cursor: 'pointer',
            display: message.sender._id === user._id ? 'none' : 'inline',
          }}
        >
          <RiReplyFill />
        </span>
      )}
    </div>
  );
};

export default Message;
