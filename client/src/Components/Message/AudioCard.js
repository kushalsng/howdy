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
  messageRef
}) => {
  const { user } = ChatState();
  const isMyMessage = Boolean(message && message.sender._id === user._id);
  return (
    <div
      ref={messageRef}
      style={{
        position: 'relative',
        width: message ? '50%' : '100%',
        float: isMyMessage ? 'right' : '',
        marginTop: !message ? 0 : getMarginTop(),
        marginLeft: !message ? 0 : getMarginLeft()
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
          isMyMessage ? 'my-audio' : message ? 'not-my-audio' : ''
        }`}
        style={{
          width: '100%',
          
        }}
      >
        <source
          src={
            audioFile
              ? URL.createObjectURL(audioFile)
              : audioUrl
              ? audioUrl
              : ''
          }
          type='audio/mp3'
        />
      </audio>
      {message && (
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
