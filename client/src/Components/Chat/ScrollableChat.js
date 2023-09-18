import React, { useEffect, useRef, useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { DateTime } from 'luxon';
import DateBadge from '../Message/DateBadge';
import Message from '../Message/Message';
import GroupLog from '../Message/GroupLog';
import { isSameUser } from '../../utils/chat';
import { ChatState } from '../../Context/ChatProvider';
import { avatarWidth } from '../../Constants/message';
import { Spinner } from '@chakra-ui/react';

const ScrollableChat = ({
  messages,
  setReplyOfMessage,
  inputBoxRef,
  isTyping,
  setIsAtBottom,
  isAtBottom,
  setIsOpenEmojiPicker,
  setIsAtTop,
  fetchingMessages,
}) => {
  const { user } = ChatState();
  const feedRef = useRef(null);
  const messageBoxRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [ target ] = entries;
        setIsAtTop(target.isIntersecting);
      },
      { root: messageBoxRef.current, threshold: [1] }
    );
    const topElement = messageBoxRef.current.children[0].children[0];
    console.log(topElement);
    observer.observe(topElement);
    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (
      (messages &&
        messages.length &&
        messages[messages.length - 1].sender._id === user._id) ||
      (isTyping && isAtBottom)
    ) {
      feedRef.current.scrollToBottom();
    }
  }, [messages, isTyping]);
  return (
    <div
      className='messages'
      onClick={() => setIsOpenEmojiPicker(false)}
      ref={messageBoxRef}
    >
      {fetchingMessages && <Spinner ml='auto' display='flex' justifyContent='center' />}
      <ScrollableFeed
        ref={feedRef}
        onScroll={(isAtBottom) => setIsAtBottom(isAtBottom)}
      >
        {messages &&
          messages.map((message, index) => (
            <React.Fragment key={index}>
              {(index === 0 ||
                DateTime.fromISO(messages[index - 1].updatedAt).toFormat(
                  'dd/LL/yyyy'
                ) !==
                  DateTime.fromISO(message.updatedAt).toFormat(
                    'dd/LL/yyyy'
                  )) && (
                <DateBadge message={message} messageBoxRef={messageBoxRef} />
              )}
              {message.isGroupLog ? (
                <GroupLog message={message} messageBoxRef={messageBoxRef} />
              ) : (
                <>
                  {!isSameUser(messages, message, index, user._id) &&
                    message.sender._id !== user._id &&
                    message.chat.isGroupChat && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          marginLeft: avatarWidth + 8,
                        }}
                      >
                        {message.sender.name}
                      </span>
                    )}
                  <Message
                    index={index}
                    message={message}
                    messages={messages}
                    messageBoxRef={messageBoxRef}
                    inputBoxRef={inputBoxRef}
                    setReplyOfMessage={setReplyOfMessage}
                  />
                </>
              )}
            </React.Fragment>
          ))}
      </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;
