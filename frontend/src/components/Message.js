import React from 'react';

const Message = ({ msg, index, setShowEmojiPicker }) => {
  return (
    <div className={`mb-4 p-4 max-w-xs rounded-lg ${
        msg.sender === 'user'
          ? 'bg-black text-white self-end'
          : 'bg-gray-200 text-black self-start'
      } relative`}
    >
      {msg.text}
    </div>
  );
};

export default Message;
