import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
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

      if (response.translation && response.translation.translated_text) {
        botText = response.translation.translated_text;

      } else if (response.definition && response.definition.html) {
        botText = response.definition.html;
        isHtml = true;

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', maxWidth: 920, mx: 'auto', p: { xs: 1.5, md: 3 }, gap: 2 }}>
      <Paper sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 3 }, border: '1px solid #E8DED2' }}>
        {messages.length === 0 && (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center', color: 'text.secondary' }}>
            <Box>
              <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>Ask Vaak</Typography>
              <Typography>Translate a phrase, define a word, or ask for an example.</Typography>
            </Box>
          </Box>
        )}
        {messages.map((msg, index) => (
          <motion.div
            key={`${msg.sender}-${index}-${msg.text.slice(0, 12)}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
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

      <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" color="primary" onClick={handleSend} sx={{ px: 4 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
