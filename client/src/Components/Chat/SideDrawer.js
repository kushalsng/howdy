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
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import Howdy from '../Howdy'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from '../Modals/ProfileModal'


const SideDrawer = () => {
  const [ search , setSearch ] = useState("")
  const [ userList, setUserList ] = useState([])
  const [ loading , setLoading ] = useState(false)
  const [ loadingChat , setLoadingChat ] = useState(false)

  const { user } = ChatState()

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          label="Search Users"
          hasArrow
          placement='bottom-end'
        >
          <Button variant="ghost">
          <i class="fas fa-search"></i>
          <Text display={{base: "none", md: "flex"}} px={4}>Search User</Text>
          </Button>
        </Tooltip>
        <Howdy />
        <div>
          <Menu>
            <MenuButton p={2} mx={4}>
              <i class="fa-solid fa-bell"></i>
            </MenuButton>
            <MenuList>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
              <Avatar size="sm" color='black' cursor="pointer" name={user.name} src={user.userPic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  )
}

export default SideDrawer