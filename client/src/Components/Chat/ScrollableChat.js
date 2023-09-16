import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { DateTime } from 'luxon';
import DateBadge from '../Message/DateBadge';
import Message from '../Message/Message';
import GroupLog from '../Message/GroupLog';
import { isSameUser } from '../../utils/chat';
import { ChatState } from '../../Context/ChatProvider';
import { avatarWidth } from '../../Constants/message';

const ScrollableChat = ({
  messages,
  messageBoxRef,
  setReplyOfMessage,
  inputBoxRef,
}) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed forceScroll>
      {messages &&
        messages.map((message, index) => (
          <React.Fragment key={index}>
            {(index === 0 ||
              DateTime.fromISO(messages[index - 1].updatedAt).toFormat(
                'dd/LL/yyyy'
              ) !==
                DateTime.fromISO(message.updatedAt).toFormat('dd/LL/yyyy')) && (
              <DateBadge message={message} messageBoxRef={messageBoxRef} />
            )}
            {message.isGroupLog ? (
              <GroupLog message={message} messageBoxRef={messageBoxRef} />
            ) : (
              <>
                {(!isSameUser(messages, message, index, user._id) &&
                  message.sender._id !== user._id &&
                  message.chat.isGroupChat) && (
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
  );
};

export default ScrollableChat;
