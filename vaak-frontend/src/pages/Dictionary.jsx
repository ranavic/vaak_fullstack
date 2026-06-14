import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { fetchDictionaryDefinition } from '../api/api';
import PageShell from '../components/PageShell';

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
      const data = await fetchDictionaryDefinition(word);
      setResult(data);
    } catch (err) {
      setError('Word not found or an error occurred.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <PageShell title="Dictionary">
      <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ px: 4 }}>
          Search
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {result && (
        <Paper sx={{ p: 3, border: '1px solid #E8DED2' }}>
          <Typography variant="h5">{result.word}</Typography>
          {result.phonetics?.length > 0 && (
            <Typography variant="subtitle1" color="text.secondary">
              {result.phonetics.join(', ')}
            </Typography>
          )}
          {result.meanings && result.meanings.map((meaning, index) => (
            <Box key={`${meaning.partOfSpeech}-${index}`} sx={{ mt: 2 }}>
              <Typography variant="h6">{meaning.partOfSpeech}</Typography>
              {meaning.definitions.map((definition, i) => (
                <Box key={`${definition.definition}-${i}`} sx={{ mt: 1 }}>
                  <Typography variant="body1">{definition.definition}</Typography>
                  {definition.example && <Typography variant="body2" color="text.secondary"><em>e.g., {definition.example}</em></Typography>}
                </Box>
              ))}
            </Box>
          ))}
        </Paper>
      )}
    </PageShell>
  );
};

export default Dictionary;
