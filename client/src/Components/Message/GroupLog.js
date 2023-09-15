import React, { useEffect, useRef, useState } from 'react';

const GroupLog = ({ message, messageBoxRef }) => {
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
    <div>
      <span
        ref={ref}
        style={{
          marginLeft: marginLeft,
          fontSize: ' 0.8rem',
        }}
      >
        {message.content}
      </span>
    </div>
  );
};

export default GroupLog;
