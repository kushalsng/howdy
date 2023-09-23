import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { RiCloseLine } from 'react-icons/ri';
import { DateTime } from 'luxon';

const AudioCard = ({
  audioFile,
  clearAudioFile,
  message,
  audioUrl,
  getMarginTop,
  getMarginLeft,
  messageRef,
  isReply,
  messageSent,
  messageOfReply,
}) => {
  const { user } = ChatState();
  const isMyMessage = Boolean(message && message.sender._id === user._id);
  return (
    <div
      ref={messageRef}
      style={{
        position: 'relative',
        width: message && !isReply ? '50%' : '100%',
        float: isMyMessage ? 'right' : '',
        marginTop: !message ? 0 : !isReply && getMarginTop(),
        marginLeft: !message ? 0 : !isReply && getMarginLeft(),
      }}
    >
      {!message && (
        <span
          onClick={clearAudioFile}
          style={{
            position: 'absolute',
            zIndex: 1,
            right: '1.1rem',
            fontSize: '1.1rem',
            cursor: 'pointer',
            top: '2px',
          }}
        >
          <RiCloseLine />
        </span>
      )}
      <audio
        controls
        preload='metadata'
        className={`${
          !isReply
            ? ''
            : messageSent
            ? messageOfReply.sender._id === user._id
              ? 'reply-self'
              : 'not-reply-self'
            : isMyMessage
            ? 'replying my-audio'
            : 'replying not-my-audio'
        } ${isReply ? '' : isMyMessage ? 'my-audio' : 'not-my-audio'}`}
        style={{
          width: '100%',
        }}
      >
        <source
          src={
            isReply
              ? null
              : audioFile
              ? URL.createObjectURL(audioFile)
              : audioUrl
              ? audioUrl
              : null
          }
          type='audio/mp3'
        />
      </audio>
      {message && !isReply && (
        <span
          style={{
            fontSize: '0.65rem',
            color: '#595959',
            float: 'right',
            position: 'absolute',
            zIndex: 1,
            right: '1.2rem',
            cursor: 'pointer',
            bottom: '2px',
          }}
        >
          {DateTime.fromISO(message.updatedAt).toFormat('T')}
        </span>
      )}
    </div>
  );
};

export default AudioCard;
