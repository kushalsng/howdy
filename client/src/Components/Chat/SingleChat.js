import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons';
import { getReceiver } from '../../utils/getReceiver';
import ProfileModal from '../Modals/ProfileModal'
import GroupChatModal from '../Modals/GroupChatModal';

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat } = ChatState();
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
                  <IconButton display={{base: "flex"}} icon={<ViewIcon />} />
                </GroupChatModal>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="hidden"
            overflowY="hidden"
          >
            {/* Messages Here  */}
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
