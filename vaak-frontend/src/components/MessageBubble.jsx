import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const MessageBubble = ({ sender, text, isHtml, intent }) => {
  const isUser = sender === "user";
  const renderAsHtml = isHtml && intent === "define";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: "70%",
          backgroundColor: isUser ? "#8B5E34" : "rgba(255, 250, 236, 1)",
          color: isUser ? "#FFF9F5" : "#3C2C20",
          borderRadius: isUser ? "16px 16px 0 16px" : "16px 16px 16px 0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        {renderAsHtml ? (
          <Typography
            variant="body1"
            component="span"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ) : (
          <Typography variant="body1">{text}</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default MessageBubble;
