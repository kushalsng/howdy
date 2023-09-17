import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Text } from '@chakra-ui/react';
import {
  getReceiver,
  isDayBeforeYesterday,
  isYesterday,
} from '../../utils/chat';
import { DateTime } from 'luxon';

const ChatListCard = ({ chat }, key) => {
  const { selectedChat, setSelectedChat, user: loggedInUser } = ChatState();
  return (
    <Box
      onClick={() => setSelectedChat(chat)}
      cursor='pointer'
      bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
      color={selectedChat === chat ? 'white' : 'black'}
      px={3}
      py={2}
      borderRadius='lg'
      key={key}
    >
      <Text>
        <Box>
          <span className='text-wrapper'>
            {!chat.isGroupChat
              ? getReceiver(loggedInUser, chat.users).name
              : chat.name}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: selectedChat?._id === chat._id ? '#353535' : '#595959',
              float: 'right',
              marginTop: '5px',
            }}
          >
            {isYesterday(
              chat.latestMessage ? chat.latestMessage.updatedAt : chat.updatedAt
            )
              ? 'Yesterday'
              : DateTime.fromISO(
                  chat.latestMessage
                    ? chat.latestMessage.updatedAt
                    : chat.updatedAt
                ).toFormat(
                  isDayBeforeYesterday(
                    chat.latestMessage
                      ? chat.latestMessage.updatedAt
                      : chat.updatedAt
                  )
                    ? 'd/M/yyyy'
                    : 'T'
                )}
          </span>
        </Box>
      </Text>
      <Text
        className='text-wrapper'
        fontSize='0.9rem'
        color={selectedChat?._id === chat._id ? '#353535' : '#595959'}
      >
        {chat.latestMessage
          ? ` ${
              chat.latestMessage.isGroupLog
                ? ''
                : chat.latestMessage.sender === loggedInUser._id
                ? 'You: '
                : chat.isGroupChat
                ? chat.users
                    .find((user) => user._id === chat.latestMessage.sender)
                    ?.name.split(' ')[0] + ': '
                : ''
            }${chat.latestMessage.content}`
          : `${chat.groupAdmin.name.split(' ')[0]} created the group`}
      </Text>
    </Box>
  );
};

export default ChatListCard;
