import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { fetchTranslation, fetchLanguages } from '../api/api';

const Translate = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [romanizedText, setRomanizedText] = useState(''); // 👈 new state
  const [sourceLang, setSourceLang] = useState('auto'); // default to auto-detect
  const [targetLang, setTargetLang] = useState('en');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [langLoading, setLangLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null);

  useEffect(() => {
    const getLanguages = async () => {
      setLangLoading(true);
      try {
        const fetchedLanguages = await fetchLanguages();
        setLanguages(fetchedLanguages);
      } catch (err) {
        console.error('Failed to fetch languages:', err);
      }
      setLangLoading(false);
    };
    getLanguages();
  }, []);

  const handleTranslate = async () => {
    if (text.trim() === '') return;

    setLoading(true);
    setError(null);
    setTranslatedText('');
    setRomanizedText('');
    setDetectedLang(null);

    try {
      const response = await fetchTranslation(text, targetLang, sourceLang);
      setTranslatedText(response.translated_text);
      if (response.source_lang) setDetectedLang(response.source_lang);

      // 👇 New check for failed auto-detection
      if (
        sourceLang === 'auto' &&
        response.translated_text &&
        response.translated_text.trim().toLowerCase() === text.trim().toLowerCase()
      ) {
        setError("Couldn't detect the language automatically. Try selecting the source language manually.");
      }

      if (response.romanized_text) {
        setRomanizedText(response.romanized_text);
      }
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
          {langLoading ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 56,
              }}
            >
              <CircularProgress size={32} />
            </Box>
          ) : (
            <>
              <FormControl fullWidth>
                <InputLabel>Source Language</InputLabel>
                <Select
                  value={sourceLang}
                  label="Source Language"
                  onChange={(e) => setSourceLang(e.target.value)}
                >
                  <MenuItem value="auto">Auto Detect</MenuItem>
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Target Language</InputLabel>
                <Select
                  value={targetLang}
                  label="Target Language"
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleTranslate}
          sx={{ mt: 2 }}
        >
          Translate
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {translatedText && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6">Translated Text</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {translatedText}
          </Typography>

          {/* Romanized output (English alphabet form) */}
          {romanizedText && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontStyle: 'italic', mb: 1 }}
            >
              {romanizedText}
            </Typography>
          )}

          {detectedLang && (
            <Typography variant="caption" color="textSecondary">
              Detected Source: {detectedLang.toUpperCase()} → {targetLang.toUpperCase()}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Translate;
