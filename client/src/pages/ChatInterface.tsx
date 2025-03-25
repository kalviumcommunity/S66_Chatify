import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

const ChatInterface: React.FC = () => {
  const location = useLocation();
  const { username, roomCode } = location.state as { username: string; roomCode: string };
  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('https://s66-chatify.onrender.com');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      console.log(`ℹ️ Joining room: ${roomCode}`);
      newSocket.emit('joinRoom', roomCode);

      // Fetch previous messages when joining a room
      newSocket.emit('getPreviousMessages', roomCode);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err);
    });

    // Handle receiving previous messages
    newSocket.on('previousMessages', (messages) => {
      console.log('📜 Previous messages:', messages);
      setMessages(messages);
    });

    // Handle receiving new messages
    newSocket.on('receiveMessage', (data) => {
      console.log('📩 Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      newSocket.off('receiveMessage');
      newSocket.off('previousMessages');
      newSocket.disconnect();
    };
}, [roomCode]);

// Auto-scroll to bottom when new messages arrive
useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

const sendMessage = () => {
    if (input.trim() && socket) {
      const messageData = { roomCode, user: username, message: input };
      console.log('📤 Sending message:', messageData);
      socket.emit('sendMessage', messageData);
      setInput('');
    }
};


  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.roomTitle}>Room: {roomCode}</h2>
        <div style={styles.username}>Logged in as: {username}</div>
      </div>
      
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            style={msg.user === username ? styles.myMessage : styles.otherMessage}
          >
            <div style={styles.messageHeader}>
              <strong>{msg.user}</strong>
            </div>
            <div style={styles.messageContent}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={styles.input}  
          placeholder="Type a message..."
        />
        <button 
          onClick={sendMessage} 
          style={styles.sendButton}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};


// Styles
const styles = {
  container: {
    backgroundColor: '#16161A',
    color: '#FFFFFF',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '20px',
    boxSizing: 'border-box' as const,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #27272A',
    marginBottom: '15px',
  },
  roomTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  username: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    padding: '10px 0',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#7F5AF0',
    borderRadius: '18px 18px 0 18px',
    padding: '10px 15px',
    maxWidth: '70%',
    wordBreak: 'break-word' as const,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#27272A',
    borderRadius: '18px 18px 18px 0',
    padding: '10px 15px',
    maxWidth: '70%',
    wordBreak: 'break-word' as const,
  },
  messageHeader: {
    fontSize: '0.85rem',
    marginBottom: '4px',
  },
  messageContent: {
    fontSize: '1rem',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    padding: '15px 0',
    borderTop: '1px solid #27272A',
  },
  input: {
    flex: 1,
    backgroundColor: '#242629',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 15px',
    fontSize: '1rem',
    outline: 'none',
  },
  sendButton: {
    backgroundColor: '#7F5AF0',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '0 20px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#6B4DD1',
    },
    ':disabled': {
      backgroundColor: '#3F3F46',
      cursor: 'not-allowed',
    },
  },
};

export default ChatInterface;