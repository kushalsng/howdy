import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { getAllUsers } from '../../Helper/user_api_helper';
import UserListItem from '../User/UserListItem';
import { debounce } from '../../utils/debounce';
import UserBadgeItem from '../User/UserBadgeItem';
import { addGroupChat } from '../../Helper/chat_api_helper';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = debounce(async () => {
    if (!search) {
      setUserList([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await getAllUsers(search, 4);
      setLoading(false);
      setUserList(data.users);
    } catch (err) {
      console.error('error while searching users: ', err);
      toast({
        title: 'Unable to find users',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setLoading(false);
    }
  }, 300);

  const handleSubmit = async () => {
    if(!chatName || !selectedUsers || !selectedUsers?.length){
      toast({
        title: !chatName ? `Can't create a group without a name!` : `Can't create a group with no one!`,
        description: "All fields are mandatory",
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      return;
    }
    try {
      const { data } = await addGroupChat({
        name: chatName,
        users: selectedUsers.map(user => user._id)
      });
      setChats([data.chat, ...chats]);
      onClose();
      toast({
        title: 'A New Group Chat Created!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      
    } catch (err) {
      console.error('error while creating group chat: ', err);
      toast({
        title: 'Unable to create new group!',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleSearch();
    }
  }, [isOpen, search]);

  return (
    <>
      <span
        onClick={() => {
          onOpen();
          setSearch('');
        }}
      >
        {children}
      </span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >
            Create New Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl id='chatName' isRequired mb='1em'>
              <Input
                placeholder='Enter Group Name...'
                value={chatName}
                mb={1}
                onChange={(e) => setChatName(e.target.value)}
              />
            </FormControl>
            <FormControl id='users' isRequired mb='1em'>
              <Input
                placeholder='Add Users...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" w="100%" flexWrap="wrap">
              {selectedUsers?.map((user, index) => (
                <UserBadgeItem
                  key={index}
                  user={user}
                  handleRemove={() =>
                    setSelectedUsers(
                      selectedUsers.filter((selectedUser) => selectedUser._id !== user._id)
                    )
                  }
                />
              ))}
            </Box>
            {loading ? (
              <div>loading...</div>
            ) : (
              userList
                ?.filter(
                  (user) =>
                    !selectedUsers.find(
                      (selectedUser) => selectedUser._id === user._id
                    )
                )
                .map((user, index) => (
                  <UserListItem
                    key={index}
                    user={user}
                    handleClick={() => {
                      setSelectedUsers([...selectedUsers, user]);
                      setSearch("")
                    }}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
