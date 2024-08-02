import React, { useState } from 'react';
import Picker from 'emoji-picker-react';



const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const sendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
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

  const addEmoji = (event, emojiObject) => {
    setInput(input + emojiObject.emoji);
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
      <div className="flex p-4 border-t border-gray-300 bg-gray-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="ml-2 p-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
        >
          😀
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-0">
            <Picker onEmojiClick={addEmoji} />
          </div>  
        )}
        <button
          onClick={sendMessage}
          className="ml-4 p-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
