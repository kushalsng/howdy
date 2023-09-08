import { Box, Image, Text } from '@chakra-ui/react'
import React from 'react'
import waveHand from '../assets/wave-hand.png'

const Howdy = () => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Text fontSize='4xl' fontFamily='Work sans' color='black'>
        {/* Howdy &#128075; */}
        Howdy
      </Text>
      <Image src={waveHand} alt="👋🏻" height="2.5rem" />
    </Box>
  )
}

export default Howdy