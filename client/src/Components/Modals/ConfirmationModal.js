import React from 'react'
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
  Text
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';

const ConfirmationModal = ({ onConfirm, openModal = true, isRemove, isDelete, isLeave, isAdd, isCreate, user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat } = ChatState();
  return (
    <>
      <span onClick={openModal ? onOpen : onConfirm}>{children}</span>
      <Modal size='xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minHeight="200px" >
          <ModalHeader
            fontSize="30px"
            fontFamily='Work sans'
            display="flex"
            justifyContent="center"
          >
            Are you sure?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            textAlign="center"
            justifyContent="space-between"
          >
            <Text fontSize={{base: '24px', md: '26px'}} fontFamily="Work sans">
              {isRemove || isAdd ? (
                <>{`You want to ${isRemove ? 'remove' : 'add'} ${user.name} ${isRemove ? "from" : "to"} ${selectedChat?.name}?`}</>
              ) : isCreate || isDelete ? (
                <>{`You want to ${isDelete ? 'delete' : 'create'} ${selectedChat?.name}?`}</>
              ) : isLeave ? (
                <>{`You want to leave ${selectedChat?.name}?`}</>
              ) : "You want to proceed?"}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={isDelete || isRemove || isLeave ? 'red' : isAdd || isCreate ? 'green' : 'blue'} mr={3} onClick={() => {onConfirm(); onClose()}}>
              {isDelete ? "Delete" : isRemove ? "Remove" : isLeave ? "Leave" : isAdd ? "Add" : isCreate ? "Create" : "Close"}
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConfirmationModal