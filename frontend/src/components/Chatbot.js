import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import EmojiPickerMenu from './EmojiPickerMenu';
import FileUpload from './FileUpload';
import emojiData from './emojiData';

const replaceEmojis = (text) => {
  let newText = text;
  const regex = /:\w+:/g;
  const matches = text.match(regex);

  if (matches) {
    matches.forEach((match) => {
      const shortcode = match.slice(1, -1);
      const emoji = emojiData.emojis[shortcode];
      if (emoji) {
        newText = newText.replace(match, emoji.skins[0].native);
      }
    });
  }

  return newText;
};

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const formattedMessage = replaceEmojis(input);
      setMessages([...messages, { text: formattedMessage, sender: 'user', emojis: [] }]);
      setInput('');
      setShowEmojiPicker(false);
      adjustTextareaHeight();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !isComposing) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleGlobalKeyDown = (event) => {
    if (event.key === 'Enter' && !isComposing) {
      sendMessage();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [input, isComposing]);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const addEmoji = (emojiData) => {
    setInput(input + emojiData.emoji);
    setShowEmojiPicker(false);
    adjustTextareaHeight();
  };

  const handleClickOutside = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleFileUpload = (file) => {
    setMessages([...messages, { text: `File uploaded: ${file.name}`, sender: 'user', fileUrl: file.url }]);
  };

  return (
    <div className="flex flex-col w-full max-w-md h-screen bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto text-black">
        {messages.map((msg, index) => (
          <Message
            key={index}
            msg={msg}
            index={index}
            addEmoji={addEmoji}
            setShowEmojiPicker={setShowEmojiPicker}
            showEmojiPicker={showEmojiPicker}
          />
        ))}
      </div>

      <div className="flex p-4 border-t border-gray-300 bg-gray-100 relative">
        <div className='flex items-end w-full relative'>
          <div className="flex items-center w-full relative">
            <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="Type a message..."
                className="flex-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none resize-none max-h-40 min-h-6 overflow-auto"
                style={{ height: '40px' }}
          />
            <FileUpload onFileUpload={handleFileUpload} />
            <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
                😀
            </button>
          </div>
          <button
            onClick={sendMessage}
            className="ml-4 p-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center align-bottom"
            style={{ height: '40px' }}
            >
            Send
          </button>
        </div>
        <div ref={emojiPickerRef}>
          <EmojiPickerMenu
            showEmojiPicker={showEmojiPicker}
            onEmojiClick={addEmoji}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
