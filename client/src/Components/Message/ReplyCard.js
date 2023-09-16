import { Card, CardHeader, CardBody, Text, Heading } from '@chakra-ui/react';
import { RiCloseLine } from 'react-icons/ri';

import React from 'react';
import { ChatState } from '../../Context/ChatProvider';

const ReplyCard = ({ message, setReplyOfMessage }) => {
  const { user } = ChatState();
  const isMyMessage = Boolean(message.sender._id === user._id);
  return (
    <Card
      bg={
        !setReplyOfMessage ? '#dfdfdf3b' : isMyMessage ? '#DDF2FF' : '#E5FFEF'
      }
    >
      <CardHeader
        pt={1}
        pb={0}
        px={2}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: '0.9rem',
          }}
        >
          {setReplyOfMessage && <span>Replying to</span>}
          <Text
            fontWeight={500}
            color={
              setReplyOfMessage ? '#000' : isMyMessage ? '#660033' : '#003366'
            }
            fontSize={!setReplyOfMessage ? '0.8rem' : '0.9rem'}
          >
            {!isMyMessage
              ? message.sender.name
              : setReplyOfMessage
              ? 'yourself'
              : 'You'}
          </Text>
        </div>
        {setReplyOfMessage && (
          <span
            onClick={() => setReplyOfMessage(null)}
            style={{
              alignSelf: 'flex-start',
              cursor: 'pointer',
              padding: '3px 5px',
            }}
          >
            <RiCloseLine />
          </span>
        )}
      </CardHeader>

      <CardBody pb={1} pt={0} px={2} fontSize='0.9rem'>
        <Text
          color={!setReplyOfMessage ? '#777' : '#000'}
          className='text-wrapper'
        >
          {message.content}
        </Text>
      </CardBody>
    </Card>
  );
};

export default ReplyCard;
