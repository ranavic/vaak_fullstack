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
          backgroundColor: isUser ? "#7A5C43" : "#FFFFFF",
          color: isUser ? "#FFFFFF" : "#2C221B",
          borderRadius: isUser ? "16px 16px 0 16px" : "16px 16px 16px 0",
          boxShadow: "0 4px 12px rgba(44, 34, 27, 0.06)",
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
