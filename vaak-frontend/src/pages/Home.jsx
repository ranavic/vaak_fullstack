import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { ChatContext } from '../context/ChatContext';
import axiosClient from '../api/axiosClient';
import MessageBubble from '../components/MessageBubble';

const Home = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axiosClient.post('/chat', { text: input });
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInput('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <Paper sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageBubble sender={msg.sender} text={msg.text} />
          </motion.div>
        ))}
      </Paper>
      <Box sx={{ p: 2, display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" color="primary" onClick={handleSend} sx={{ ml: 2 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
