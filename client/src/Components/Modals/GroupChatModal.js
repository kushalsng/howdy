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
import {
  addGroupChat,
  addUserToGroup,
  removeUserFromGroup,
  renameGroup,
} from '../../Helper/chat_api_helper';

const GroupChatModal = ({ fetch, setFetch, isUpdate, children }) => {
  const limit = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const handleSearch = debounce(async () => {
    if (!search) {
      setUserList([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await getAllUsers(search);
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

  const handleCreateGroup = async () => {
    if (!chatName || !selectedUsers || !selectedUsers?.length) {
      toast({
        title: !chatName
          ? `Can't create a group without a name!`
          : `Can't create a group with no one!`,
        description: 'All fields are mandatory',
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
        users: selectedUsers.map((user) => user._id),
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
  const handleRenameGroup = async () => {
    if (!isUpdate) {
      toast({
        title: `Something went wrong!`,
        description: 'Invalid Request',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      return;
    }
    if (!chatName) {
      toast({
        title: `Can't name a group nothing!`,
        description: 'Please enter a valid name',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setChatName(selectedChat.name);
      return;
    }
    try {
      setRenameLoading(true);
      const { data } = await renameGroup({
        chatId: selectedChat._id,
        name: chatName,
      });
      setRenameLoading(false);
      setChatName(data.chat.name);
      setSelectedChat(data.chat);
      toast({
        title: 'Group Renamed!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    } catch (err) {
      console.error('error while renaming group chat: ', err);
      toast({
        title: 'Unable to rename group!',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setChatName(selectedChat.name);
      setRenameLoading(false);
    }
  };
  const handleAddMember = async (user) => {
    if (!isUpdate) {
      toast({
        title: `Something went wrong!`,
        description: 'Invalid Request',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      return;
    }
    if (selectedChat.users.find((chatUser) => chatUser._id === user._id)) {
      toast({
        title: `Can't add ${user.name} to ${selectedChat.name}!`,
        description: 'User already exist',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      return;
    }

    try {
      const { data } = await addUserToGroup({
        chatId: selectedChat._id,
        userId: user._id,
      });
      selectedChat.users.push(user);
      setSelectedChat({ ...selectedChat });
      toast({
        title: data.msg,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    } catch (err) {
      console.error('error while adding member to group: ', err);
      toast({
        title: 'Unable to add member!',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    }
  };
  const handleRemoveMember = async (user) => {
    if (!isUpdate) {
      toast({
        title: `Something went wrong!`,
        description: 'Invalid Request',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      return;
    }
    if (!selectedChat.users.find((chatUser) => chatUser._id === user._id)) {
      toast({
        title: `Can't remove ${user.name} from ${selectedChat.name}!`,
        description: `User doesn't exist`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      return;
    }

    try {
      const { data } = await removeUserFromGroup({
        chatId: selectedChat._id,
        userId: user._id,
      });
      const filteredUsers = selectedUsers.filter((chatUser) => chatUser._id !== user._id)
      setSelectedUsers([...filteredUsers])
      setSelectedChat({
        ...selectedChat,
        users: filteredUsers,
      });
      toast({
        title: data.msg,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    } catch (err) {
      console.error('error while removing member from group: ', err);
      toast({
        title: 'Unable to remove member!',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
    }
  };
  const handleLeaveGroup = async () => {
    if (!isUpdate) {
      toast({
        title: `Something went wrong!`,
        description: 'Invalid Request',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      return;
    }
  };
  useEffect(() => {
    if (isOpen) {
      handleSearch();
    }
  }, [isOpen, search]);
  useEffect(() => {
    if (isUpdate) {
      setChatName(selectedChat.name);
      setSelectedUsers(selectedChat.users);
    }
  }, []);
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
            {isUpdate ? selectedChat.name : 'Create New Group'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl id='chatName' isRequired mb='1em'>
              <Box display='flex' justifyContent='center' gap={2}>
                <Input
                  placeholder='Enter Group Name...'
                  value={chatName}
                  mb={1}
                  disabled={isUpdate && renameLoading}
                  w={{ base: isUpdate ? '75%' : '100%' }}
                  onChange={(e) => setChatName(e.target.value)}
                />
                <Button
                  colorScheme='blue'
                  display={{ base: isUpdate ? 'inline' : 'none' }}
                  w={{ base: '24%' }}
                  onClick={handleRenameGroup}
                >
                  Update
                </Button>
              </Box>
            </FormControl>
            {isUpdate &&
            selectedChat?.isGroupChat &&
            user._id !== selectedChat?.groupAdmin._id ? (
              <></>
            ) : (
              <FormControl id='users' isRequired mb='1em'>
                <Input
                  placeholder='Search for Members...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormControl>
            )}
            <Box display='flex' w='100%' flexWrap='wrap'>
              {selectedUsers?.map((user, index) => (
                <UserBadgeItem
                  key={index}
                  user={user}
                  handleRemove={() => {
                    if (isUpdate) {
                      handleRemoveMember(user);
                    } else {
                      setSelectedUsers(
                        selectedUsers.filter(
                          (selectedUser) => selectedUser._id !== user._id
                        )
                      );
                    }
                  }}
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
                .slice(0, limit)
                .map((user, index) => (
                  <UserListItem
                    key={index}
                    user={user}
                    handleClick={() => {
                      if (isUpdate) {
                        handleAddMember(user);
                      } else {
                        setSelectedUsers([...selectedUsers, user]);
                      }
                      setSearch('');
                    }}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            {isUpdate ? (
              <Button colorScheme='red' onClick={handleLeaveGroup}>
                Leave Group
              </Button>
            ) : (
              <Button colorScheme='blue' onClick={handleCreateGroup}>
                Create Group
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
