import { CloseIcon } from '@chakra-ui/icons'
import { Badge, Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'

const UserBadgeItem = ({user, handleRemove}, key) => {
  const { user:loggedInUser, selectedChat } = ChatState()
  return (
    <Box
      key={key}
    >
      <Badge
        colorScheme={user._id === selectedChat.groupAdmin._id ? 'green' : user._id === loggedInUser._id ? 'blue' : 'purple'}
        display="flex"
        alignItems="center"
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        fontSize={12}
        cursor="pointer"
        onClick={handleRemove}
      >
        {user.name.split(" ")[0]}
        {loggedInUser._id === selectedChat.groupAdmin._id && user._id !== selectedChat.groupAdmin._id && <CloseIcon p={1} />}
      </Badge>
    </Box>
  )
}

export default UserBadgeItem