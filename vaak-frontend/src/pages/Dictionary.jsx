import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import axiosClient from '../api/axiosClient';

const Dictionary = () => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (word.trim() === '') return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axiosClient.get(`/dictionary/${word}`);
      setResult(response.data);
    } catch (err) {
      setError('Word not found or an error occurred.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dictionary
      </Typography>
      <Box sx={{ display: 'flex', mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ ml: 2 }}>
          Search
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5">{result.word}</Typography>
          {result.phonetic && <Typography variant="subtitle1" color="text.secondary">{result.phonetic}</Typography>}
          {result.meanings && result.meanings.map((meaning, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="h6">{meaning.partOfSpeech}</Typography>
              {meaning.definitions.map((definition, i) => (
                <Box key={i} sx={{ mt: 1 }}>
                  <Typography variant="body1">{definition.definition}</Typography>
                  {definition.example && <Typography variant="body2" color="text.secondary"><em>e.g., {definition.example}</em></Typography>}
                </Box>
              ))}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default Dictionary;
