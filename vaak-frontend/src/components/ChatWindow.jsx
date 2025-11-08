import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import { sendChatMessage } from "../api/api";

const ChatWindow = () => {
  const { navHeight } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const messagesEndRef = useRef(null);

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
      let isHtml = false;
      let intent = res.intent || "";

      if (res.translation?.translated_text) botText = res.translation.translated_text;
      else if (res.definition) {
        if (res.definition.html) {
          botText = res.definition.html;
          isHtml = true;
          intent = "define";
        } else botText = JSON.stringify(res.definition, null, 2);
      } else if (res.example) botText = res.example;
      else if (res.text) botText = res.text;
      else botText = JSON.stringify(res);

      const botMessage = {
        text: botText,
        sender: "bot",
        isHtml: !!(res.definition && res.definition.html),
        intent: res.intent || "",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not get response.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: `calc(100vh - ${navHeight}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        backgroundColor: "#FFF9F0",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          p: { xs: 1, sm: 2 },
          backgroundColor: "#FFF9F0",
        }}
      >
        {/* Scrollable chat area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: { xs: 1, sm: 2 },
            pr: { xs: 0.5, sm: 1 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              text={msg.text}
              sender={msg.sender}
              isHtml={msg.isHtml}
              intent={msg.intent}
            />
          ))}
          {loading && <Loader />}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input & send button (responsive stack) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 1 },
            mb: { xs: 0.5, sm: 1 },
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            size="small"
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#8B5E34",
              "&:hover": { backgroundColor: "#b87a40ff" },
              textTransform: "none",
              fontWeight: 500,
              py: { xs: 1, sm: 1.2 },
            }}
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>

        {/* Language selector */}
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 0.5, sm: 0 },
          }}
        >
          <Typography variant="body2">Translate to:</Typography>
          <TextField
            select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 120 },
            }}
          >
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
          </TextField>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatWindow;
