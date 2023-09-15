import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { DateTime } from 'luxon';
import DateBadge from '../Message/DateBadge';
import Message from '../Message/Message';
import GroupLog from '../Message/GroupLog';

const ScrollableChat = ({ messages, messageBoxRef }) => {
  return (
    <ScrollableFeed>
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
              <Message index={index} message={message} messages={messages} />
            )}
          </React.Fragment>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
