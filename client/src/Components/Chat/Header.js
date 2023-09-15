import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import Howdy from '../Howdy';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from '../Modals/ProfileModal';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../Helper/user_api_helper';
import ListLoading from '../Loaders/ListLoading';
import UserListItem from '../User/UserListItem';
import { fetchOrCreateChat } from '../../Helper/chat_api_helper';
import { debounce } from '../../utils/debounce';
import { getReceiver } from '../../utils/chat';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

const Header = () => {
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    notifications,
    setNotifications,
    setSelectedChat,
    chats,
    setChats,
    setIsLoggedOut
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedOut(true);
    navigate('/');
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await fetchOrCreateChat({ userId });
      if (!chats.find((chat) => chat._id === data.chat._id)) {
        setChats([data.chat, ...chats]);
      }
      setLoadingChat(false);
      setSelectedChat(data.chat);
      onClose();
    } catch (err) {
      console.error('error while fetching chat: ', err);
      toast({
        title: 'Unable to fetch your conversation!',
        description: err.response.data.msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom',
        variant: 'left-accent',
      });
      setLoadingChat(false);
    }
  };
  const onSearch = debounce(async function () {
    try {
      setLoading(true);
      const { data } = await getAllUsers(search);
      setLoading(false);
      setUserList(data.users);
    } catch (err) {
      console.error('error while getting users: ', err);
      toast({
        title: 'Unable to Find People',
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

  useEffect(() => {
    if (isOpen) {
      onSearch();
    }
  }, [isOpen, search]);
  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip label='Search Users' hasArrow placement='bottom-end'>
          <Button
            variant='ghost'
            onClick={() => {
              onOpen();
              setSearch('');
            }}
          >
            <i className='fas fa-search'></i>
            <Text display={{ base: 'none', md: 'flex' }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Howdy />
        <div>
          <Menu>
            <MenuButton p={2} mx={4}>
              <NotificationBadge
                count={notifications ? notifications.reduce((count, notif) => (count + notif.count), 0) : 0}
                effect={Effect.SCALE}
              />
              <BellIcon />
            </MenuButton>
            <MenuList px={2}>
              {!notifications?.length ? (
                'No New Notifications'
              ) : (
                <>
                  {notifications?.map((notification, index) => (
                    <MenuItem
                      key={index}
                      cursor='pointer'
                      onClick={() => {
                        setSelectedChat(notification);
                        setChats([notification, ...chats.filter((chat) => chat._id !== notification._id)])
                        setNotifications(
                          notifications?.filter(
                            (notif) => notif._id !== notification._id
                          )
                        );
                      }}
                    >
                      {notification.isGroupChat
                        ? `${notification.count} New Message${
                            notification.count > 1 ? 's' : ''
                          } in ${notification.name}`
                        : `${notification.count} New Message${
                            notification.count > 1 ? 's' : ''
                          } from ${getReceiver(user, notification.users).name}`}
                    </MenuItem>
                  ))}
                </>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size='sm'
                color='black'
                cursor='pointer'
                name={user.name}
                src={user.userPic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Start a Chat</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Find them here...'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
            {loading ? (
              <ListLoading />
            ) : (
              userList?.map((user, index) => (
                <UserListItem
                  key={index}
                  user={user}
                  handleClick={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner ml='auto' display='flex' justifyContent='center' />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
