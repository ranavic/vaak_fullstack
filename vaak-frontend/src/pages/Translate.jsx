import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axiosClient from '../api/axiosClient';

const Translate = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (text.trim() === '') return;

    setLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const response = await axiosClient.post('/translate', { text, source_lang: sourceLang, target_lang: targetLang });
      setTranslatedText(response.data.translated_text);
    } catch (err) {
      setError('Translation failed or an error occurred.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Translate
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Source Language</InputLabel>
            <Select value={sourceLang} label="Source Language" onChange={(e) => setSourceLang(e.target.value)}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              {/* Add more languages as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Target Language</InputLabel>
            <Select value={targetLang} label="Target Language" onChange={(e) => setTargetLang(e.target.value)}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              {/* Add more languages as needed */}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" onClick={handleTranslate} sx={{ mt: 2 }}>
          Translate
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {translatedText && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6">Translated Text</Typography>
          <Typography variant="body1">{translatedText}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Translate;
