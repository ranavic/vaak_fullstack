import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { ChatContext } from '../context/ChatContext';
import { sendChatMessage } from '../api/api';
import MessageBubble from '../components/MessageBubble';
import Loader from '../components/Loader';

const Home = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(currentInput, 'en');
      let botText = '';
      let isHtml = false;
      let intent = response.intent || '';

      // ✅ Handle different intents
      if (response.translation && response.translation.translated_text) {
        botText = response.translation.translated_text;

      } else if (response.definition && response.definition.html) {
        botText = response.definition.html;
        isHtml = true; // Only HTML if definition contains markup

      } else if (response.example) {
        botText = response.example;

      } else if (response.text) {
        botText = response.text;

      } else {
        botText = JSON.stringify(response);
      }

      const botMessage = { sender: 'bot', text: botText, isHtml, intent };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.', isHtml: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
            {/* ✅ Pass both isHtml and intent */}
            <MessageBubble
              sender={msg.sender}
              text={msg.text}
              isHtml={msg.isHtml}
              intent={msg.intent}
            />
          </motion.div>
        ))}
        {isLoading && <Loader />}
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
