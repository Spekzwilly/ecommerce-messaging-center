import React from 'react';
import EmojiPicker from 'emoji-picker-react';


const EmojiPickerMenu = ({ showEmojiPicker, onEmojiClick }) => {
  return (
    showEmojiPicker && (
      <div className="absolute bottom-20 right-4 z-10">
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </div>
    )
  );
};

export default EmojiPickerMenu;
