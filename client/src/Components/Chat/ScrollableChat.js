import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameUser,
  sameSenderMargin,
} from '../../utils/chat';
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Box } from '@chakra-ui/react';
import { DateTime } from 'luxon';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div key={index} style={{ display: 'flex' }}>
            {(isSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Avatar
                mt='7px'
                mr='1'
                size='sm'
                cursor='pointer'
                name={message.sender.name}
                src={message.sender.userPic}
              />
            )}
            <span
              style={{
                backgroundColor:
                  message.sender._id === user._id ? '#BEE3F8' : '#B9F5D0',
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
                marginLeft: sameSenderMargin(
                  messages,
                  message,
                  index,
                  user._id
                ),
                marginTop: isSameUser(messages, message, index, user._id)
                  ? 3
                  : 10,
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
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
