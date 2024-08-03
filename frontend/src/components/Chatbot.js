import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { init } from 'emoji-mart';
import data from '@emoji-mart/data';



init({ data });



const customEmojiMap = {
    ':D': '😃',
    ':)': '😊',
    ':P': '😛',
    ':smile:': '😄',
    ':laughing:': '😆',
    ':blush:': '😊',
    ':heart:': '❤️',
    ':thumbsup:': '👍',
    ':ok_hand:': '👌',
  };



const replaceEmojis = (text) => {
    let newText = text;
    // 使用正則表達式查找所有 :<shortcode>: 格式的表情符號
    for (const [key, value] of Object.entries(customEmojiMap)) {
        newText = newText.split(key).join(value);
      }

    const regex = /:\w+:/g;
    const matches = text.match(regex);
  
    if (matches) {
      matches.forEach((match) => {
        const shortcode = match.slice(1, -1); // 移除兩邊的冒號
        const emoji = data.emojis[shortcode];
        if (emoji) {
          newText = newText.replace(match, emoji.skins[0].native);
        }
      });
    }
  
    return newText;
  };

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const replacedInput = replaceEmojis(input);
      setMessages([...messages, { text: replacedInput, sender: 'user' }]);
      setInput('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !isComposing) {
      sendMessage();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };


  const addEmoji = (emojiData) => {
    console.log("addEmoji function called");
    console.log(emojiData); // 查看 emojiData 的內容
    setInput(input + emojiData.emoji); // 使用 emojiData.emoji 添加表情符號
    setShowEmojiPicker(false);
  };
  


  return (
    <div className="flex flex-col w-full max-w-md h-screen bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto text-black">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-4 max-w-xs rounded-lg ${
              msg.sender === 'user'
                ? 'bg-black text-white self-end'
                : 'bg-gray-200 text-black self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t border-gray-300 bg-gray-100 relative">
        <div className="flex items-center w-full relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none pr-3" // 右邊留出足夠空間給 emoji picker icon 跟 send button
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            😀
          </button>
        </div>
        <button
          onClick={sendMessage}
          className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 ml-2" // 左邊留出間隔
        >
          Send
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-0 z-10">
            <EmojiPicker onEmojiClick={addEmoji} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
