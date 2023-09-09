import React from 'react'
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
import { ChatState } from '../../Context/ChatProvider';

const ConfirmationModal = ({ isRemove, isDelete, isAdd, isCreate, user, children, onConfirm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat } = ChatState();
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal size='md' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minHeight="200px" >
          <ModalHeader
            fontSize="40px"
            fontFamily='Work sans'
            display="flex"
            justifyContent="center"
          >
            Are you sure
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize={{base: '28px', md: '30px'}} fontFamily="Work sans">
              {isRemove || isAdd ? (
                <>{`You want to ${isRemove ? 'remove' : 'add'} ${user.name} to ${selectedChat.name}?`}</>
              ) : isCreate || isDelete ? (
                <></>
              ) : "You want to proceed?"}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={isDelete || isRemove ? 'red' : isAdd || isCreate ? 'green' : 'blue'} mr={3} onClick={() => {}}>
              {isDelete ? "Delete" : isRemove ? "Remove" : isAdd ? "Add" : isCreate ? "Create" : "Close"}
            </Button>
            <Button variant='ghost'>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConfirmationModal