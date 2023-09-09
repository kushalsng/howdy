import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ListLoading = ({count = 12}) => {
  return (
    <Stack>
      {[...Array(count)].map( i => (
        <Skeleton height='55px' />
      ))}
    </Stack>
  )
}

export default ListLoading