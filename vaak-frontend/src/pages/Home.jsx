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
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(currentInput, 'en');
      let botText = '';
      if (response.translation && response.translation.translated_text) {
        botText = response.translation.translated_text;
      } else if (response.definition) {
        // Format dictionary definition for readability
        const def = response.definition;
        let formatted = '';
        if (def.word) {
          formatted += `<strong>${def.word}</strong><br/>`;
        }
        if (def.phonetics && def.phonetics.length > 0) {
          const phonetics = def.phonetics.map(p => p.text).filter(Boolean).join(', ');
          if (phonetics) formatted += `<em>Phonetics:</em> ${phonetics}<br/>`;
        }
        if (def.meanings && def.meanings.length > 0) {
          def.meanings.forEach((meaning, i) => {
            formatted += `<div style='margin-top:6px;'><b>${i + 1}. ${meaning.partOfSpeech}</b><ul style='margin:0 0 0 18px;padding:0;'>`;
            meaning.definitions.forEach((d, j) => {
              formatted += `<li>${d.definition}`;
              if (d.example) formatted += `<br/><span style='color:#666;'>e.g., ${d.example}</span>`;
              formatted += `</li>`;
            });
            formatted += `</ul></div>`;
          });
        }
        if (def.sourceUrls && def.sourceUrls.length > 0) {
          formatted += `<div style='margin-top:8px;'><a href='${def.sourceUrls[0]}' target='_blank' rel='noopener noreferrer'>Source</a></div>`;
        }
        botText = formatted.trim() || 'No definition found.';
        const botMessage = { sender: 'bot', text: botText, isHtml: true };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        return;
      } else if (response.example) {
        botText = response.example;
      } else if (response.text) {
        botText = response.text;
      } else {
        botText = JSON.stringify(response);
      }
      const botMessage = { sender: 'bot', text: botText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
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
             <MessageBubble sender={msg.sender} text={msg.text} isHtml={msg.isHtml} />
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
