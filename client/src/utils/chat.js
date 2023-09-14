import { DateTime } from 'luxon';

export const getReceiver = (loggedInUser, users) => {
  return users[0]._id === loggedInUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, message, index, userId) => {
  return (
    index < messages.length - 1 &&
    (!messages[index + 1].sender._id ||
      messages[index + 1].sender._id !== message.sender._id) &&
    messages[index].sender._id !== userId
  );
};

export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id &&
    messages[messages.length - 1].sender._id !== userId
  );
};

export const sameSenderMargin = (messages, message, index, userId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender._id === message.sender._id &&
    messages[index].sender._id !== userId
  )
    return 33;
  else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender._id !== message.sender._id &&
      messages[index].sender._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender._id !== userId)
  )
    return 0;
  return 'auto';
};

export const isSameUser = (messages, message, index) => {
  return index > 0 && messages[index - 1].sender._id === message.sender._id;
};

export const isYesterday = (dateTime) => {
  return (
    DateTime.now().minus({ days: 1 }).toFormat('dd/MM/yyyy') ===
    DateTime.fromISO(dateTime).toFormat('dd/MM/yyyy')
  );
};
export const isDayBeforeYesterday = (dateTime) => {
  return DateTime.now().minus({ days: 1 }) > DateTime.fromISO(dateTime);
};
