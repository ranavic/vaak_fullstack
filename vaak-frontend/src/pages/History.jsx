import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosClient from '../api/axiosClient';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [defOpen, setDefOpen] = useState(false);
  const [defContent, setDefContent] = useState('');

  // 🔍 Fetch definition in popup
  const handleWordClick = async (word) => {
    try {
      const res = await axiosClient.get(`/api/dict/define/${word}`);
      let botText = '';
      const def = res.data;

      if (def.word) botText += `<strong>${def.word}</strong><br/>`;

      if (def.phonetics?.length > 0) {
        const phonetics = def.phonetics.map((p) => p.text).filter(Boolean).join(', ');
        if (phonetics) botText += `<em>Phonetics:</em> ${phonetics}<br/>`;
      }

      if (def.meanings?.length > 0) {
        def.meanings.forEach((meaning, i) => {
          botText += `<div style='margin-top:6px;'><b>${i + 1}. ${meaning.partOfSpeech}</b><ul style='margin:0 0 0 18px;padding:0;'>`;
          meaning.definitions.forEach((d, j) => {
            botText += `<li>${d.definition}`;
            if (d.example) botText += `<br/><span style='color:#666;'>e.g., ${d.example}</span>`;
            botText += `</li>`;
          });
          botText += `</ul></div>`;
        });
      }

      if (def.sourceUrls?.length > 0) {
        botText += `<div style='margin-top:8px;'>
          <a href='${def.sourceUrls[0]}' target='_blank' rel='noopener noreferrer'>Source</a>
        </div>`;
      }

      botText = botText.trim() || 'No definition found.';
      setDefContent(botText);
      setDefOpen(true);
    } catch (err) {
      setDefContent('No definition found.');
      setDefOpen(true);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/api/chat/history');
      setHistory(response.data);
    } catch (err) {
      setError('Failed to fetch history.');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/api/chat/history/${id}`);
      setHistory(history.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await axiosClient.delete('/api/chat/history');
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        History
      </Typography>

      <Button
        variant="outlined"
        color="error"
        onClick={handleClearAll}
        sx={{ mb: 2,
          "&:hover": {
          color: "#FFFFFF"
        }
        }} 
      >
        Clear All History
      </Button>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      
      <Paper>
        <List>
          {history.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  // ✅ Only make words clickable if this is a dictionary lookup
                  item.intent === 'define' || item.intent === 'example' ? (
                    <span>
                      {item.query.split(' ').map((word, idx) => (
                        <React.Fragment key={idx}>
                          <span
                            style={{
                              cursor: 'pointer',
                              color: '#1976d2',
                              textDecoration: 'underline',
                            }}
                            onClick={() => handleWordClick(word)}
                          >
                            {word}
                          </span>{' '}
                        </React.Fragment>
                      ))}
                    </span>
                  ) : (
                    // Otherwise render plain text (for translations)
                    <span>{item.query}</span>
                  )
                }
                secondary={item.intent}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog
        open={defOpen}
        onClose={() => setDefOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Word Definition</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: defContent }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default History;
