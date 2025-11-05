import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const MessageBubble = ({ sender, text, isHtml }) => {
  const isUser = sender === 'user';
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          maxWidth: '70%',
        }}
      >
        {isHtml ? (
          <Typography variant="body1" component="span" dangerouslySetInnerHTML={{ __html: text }} />
        ) : (
          <Typography variant="body1">{text}</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default MessageBubble;
