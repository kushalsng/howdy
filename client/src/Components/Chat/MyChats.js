import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ListLoading from '../Loaders/ListLoading';
import {
  getReceiver,
  isDayBeforeYesterday,
  isYesterday,
} from '../../utils/chat';
import GroupChatModal from '../Modals/GroupChatModal';
import { DateTime } from 'luxon';

const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats } = ChatState();
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
          <>
            {chats.filter((chat) => chat.latestMessage).length ? (
              <Stack overflowY='scroll'>
                {chats
                  .filter((chat) => chat.latestMessage)
                  .map((chat) => (
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
                        <Box>
                          <span className='text-wrapper'>
                            {!chat.isGroupChat
                              ? getReceiver(user, chat.users).name
                              : chat.name}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: '#595959',
                              float: 'right',
                              marginTop: '5px',
                            }}
                          >
                            {isYesterday(chat.latestMessage.updatedAt)
                              ? 'Yesterday'
                              : DateTime.fromISO(
                                  chat.latestMessage.updatedAt
                                ).toFormat(
                                  isDayBeforeYesterday(
                                    chat.latestMessage.updatedAt
                                  )
                                    ? 'd/M/yyyy'
                                    : 'T'
                                )}
                          </span>
                        </Box>
                      </Text>
                      <Text
                        className='text-wrapper'
                        color={selectedChat === chat ? '#353535' : '#595959'}
                      >
                        {chat.latestMessage
                          ? ` ${
                              chat.latestMessage.sender === user._id
                                ? 'You: '
                                : chat.isGroupChat
                                ? chat.users
                                    .find(
                                      (user) =>
                                        user._id === chat.latestMessage.sender
                                    )
                                    .name.split(' ')[0] + ': '
                                : ''
                            }${chat.latestMessage.content}`
                          : ''}
                      </Text>
                    </Box>
                  ))}
              </Stack>
            ) : (
              <Box
                bg={'#E8E8E8'}
                color={'black'}
                px={3}
                py={2}
                borderRadius='lg'
              >
                <Text>Howdy {user ? user.name?.split(' ')[0] : ''}👋🏻</Text>
                <Text className='text-wrapper' color='grey'>
                  Start a conversation with someone
                </Text>
              </Box>
            )}
          </>
        ) : (
          <ListLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
