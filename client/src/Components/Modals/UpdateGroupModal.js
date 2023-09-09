import { ViewIcon } from '@chakra-ui/icons';
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider';

const UpdateGroupModal = ({fetch, setFetch}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState()

  

  return (
    <React.Fragment>
      <IconButton display={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />

      <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minHeight="200px" >
          <ModalHeader
            fontSize="40px"
            fontFamily='Work sans'
            display="flex"
            justifyContent="center"
          >
            {selectedChat.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            Bodhy
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  )
}

export default UpdateGroupModal