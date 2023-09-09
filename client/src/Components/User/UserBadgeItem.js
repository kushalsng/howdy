import { CloseIcon } from '@chakra-ui/icons'
import { Badge, Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ConfirmationModal from '../Modals/ConfirmationModal'

const UserBadgeItem = ({user, handleRemove, openModal, showClose}, key) => {
  const { user:loggedInUser, selectedChat } = ChatState()
  return (
    <ConfirmationModal
      onConfirm={handleRemove}
      isRemove={true}
      openModal={openModal}
      user={user}
    >
      <Box
        key={key}
      >
        <Badge
          colorScheme={user._id === selectedChat?.groupAdmin._id ? 'green' : user._id === loggedInUser._id ? 'blue' : 'purple'}
          display="flex"
          alignItems="center"
          px={2}
          py={1}
          borderRadius="lg"
          m={1}
          mb={2}
          fontSize={12}
          cursor="pointer"
        >
          {user.name.split(" ")[0]}
          
          {showClose && <CloseIcon p={1} />}
        </Badge>
      </Box>
    </ConfirmationModal>
  )
}

export default UserBadgeItem