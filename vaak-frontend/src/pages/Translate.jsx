import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { fetchLanguages, fetchTranslation } from "../api/api";
import PageShell from "../components/PageShell";

const Translate = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [romanizedText, setRomanizedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [langLoading, setLangLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null);

  useEffect(() => {
    const getLanguages = async () => {
      setLangLoading(true);
      try {
        setLanguages(await fetchLanguages());
      } catch (err) {
        console.error("Failed to fetch languages:", err);
        setError("Could not load languages.");
      } finally {
        setLangLoading(false);
      }
    };
    getLanguages();
  }, []);

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setTranslatedText("");
    setRomanizedText("");
    setDetectedLang(null);

    try {
      const response = await fetchTranslation(text, targetLang, sourceLang);
      setTranslatedText(response.translated_text || "");
      setRomanizedText(response.romanized_text || "");
      setDetectedLang(response.source_lang || null);

      if (
        sourceLang === "auto" &&
        response.translated_text &&
        response.translated_text.trim().toLowerCase() === text.trim().toLowerCase()
      ) {
        setError("Could not detect the language automatically. Try selecting the source language manually.");
      }
    } catch (err) {
      setError("Translation failed or an error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Translate">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          {langLoading ? (
            <Box sx={{ width: "100%", display: "grid", placeItems: "center", minHeight: 56 }}>
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

        <Button variant="contained" color="primary" onClick={handleTranslate} disabled={loading}>
          Translate
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {translatedText && (
        <Paper sx={{ p: 3, border: "1px solid #E8DED2" }}>
          <Typography variant="h6">Translated Text</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {translatedText}
          </Typography>

          {romanizedText && romanizedText !== translatedText && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
              {romanizedText}
            </Typography>
          )}

          {detectedLang && (
            <Typography variant="caption" color="text.secondary">
              Detected Source: {detectedLang.toUpperCase()} to {targetLang.toUpperCase()}
            </Typography>
          )}
        </Paper>
      )}
    </PageShell>
  );
};

export default Translate;
