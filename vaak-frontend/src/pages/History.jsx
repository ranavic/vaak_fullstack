import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, CircularProgress, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosClient from '../api/axiosClient';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get('/history');
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
      await axiosClient.delete(`/history/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await axiosClient.delete('/history');
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
      <Button variant="outlined" color="error" onClick={handleClearAll} sx={{ mb: 2 }}>
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
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.query}
                secondary={item.type}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default History;
