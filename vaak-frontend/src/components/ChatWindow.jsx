import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, MenuItem, Typography, Paper } from "@mui/material";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import { sendChatMessage } from "../api/api";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]); // { text, sender: 'user' | 'bot' }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("en"); // default language
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(input, targetLang);
      let botText = "";
      if (res.translation && res.translation.translated_text) {
        botText = res.translation.translated_text;
      } else if (res.definition) {
        botText = JSON.stringify(res.definition, null, 2);
      } else if (res.example) {
        botText = res.example;
      } else if (res.text) {
        botText = res.text;
      } else {
        botText = JSON.stringify(res);
      }
      const botMessage = { text: botText, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const botMessage = { text: "Error: Could not get response.", sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 600, margin: "20px auto", display: "flex", flexDirection: "column", height: "600px" }}>
      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2, display: "flex", flexDirection: "column" }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.text} sender={msg.sender} />
        ))}
        {loading && <Loader />}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" color="primary" onClick={handleSend}>
          Send
        </Button>
      </Box>

      {/* Language selector */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2">Translate to:</Typography>
        <TextField
          select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          size="small"
        >
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="fr">French</MenuItem>
          <MenuItem value="de">German</MenuItem>
          <MenuItem value="hi">Hindi</MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
};

export default ChatWindow;
