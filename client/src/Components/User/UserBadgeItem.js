import { CloseIcon } from '@chakra-ui/icons'
import { Badge, Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({key, user, handleRemove}) => {
  return (
    <Box
      key={key}
    >
      <Badge
        colorScheme='purple'
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
        <CloseIcon p={1} />
      </Badge>
    </Box>
  )
}

export default UserBadgeItem