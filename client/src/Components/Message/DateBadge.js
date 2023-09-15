import { DateTime } from 'luxon';
import React, { useEffect, useRef, useState } from 'react';

const DateBadge = ({ message, messageBoxRef }) => {
  const ref = useRef(null);
  const [marginLeft, setMarginLeft] = useState(0);
  const handleResize = () => {
    const messageWidth = ref.current.offsetWidth;
    const boxWidth = messageBoxRef.current.offsetWidth;
    const margin = (boxWidth - messageWidth) / 2;
    setMarginLeft(margin);
  };
  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div
      style={{
        margin: '5px 0',
      }}
    >
      <span
        ref={ref}
        style={{
          marginLeft: marginLeft,
          borderRadius: '20px',
          padding: '3px 9px',
          fontSize: ' 0.8rem',
          backgroundColor: '#ffffff',
        }}
      >
        {DateTime.fromISO(message.updatedAt).toFormat('DD')}
      </span>
    </div>
  );
};

export default DateBadge;
