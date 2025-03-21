import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [inputValue, setInputValue] = useState(''); // Track input
  const messagesRef = useRef(null);

  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    setSocket(ws);
    ws.onopen = () => console.log('Connected to WebSocket');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init') {
        setClientId(data.id);
        setMessages(data.history);
      } else if (data.type === 'message') {
        setMessages((prev) => [...prev, data]);
      }
    };
    ws.onclose = () => console.log('Disconnected');
    return () => ws.close();
  }, []);

  // Auto-scroll (unchanged)
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message function
  const sendMessage = () => {
    if (socket && inputValue.trim()) {
      socket.send(JSON.stringify({ type: 'message', message: inputValue }));
      setInputValue(''); // Clear input after sending
    }
  };

  return (
    <div className="chat-container">
      <div className="header">Chat Room</div> {/* Header */}
      <div className="messages" ref={messagesRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === clientId ? 'sent' : 'received'}
          >
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button> {/* New send button */}
      </div>
    </div>
  );
}

export default App;