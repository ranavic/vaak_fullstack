import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  clearHistory,
  deleteHistoryItem,
  fetchDictionaryDefinition,
  fetchHistory as loadHistory,
} from "../api/api";
import PageShell from "../components/PageShell";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [defOpen, setDefOpen] = useState(false);
  const [defContent, setDefContent] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      setHistory(await loadHistory());
    } catch (err) {
      setError("Failed to fetch history.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleWordClick = async (word) => {
    try {
      const def = await fetchDictionaryDefinition(word);
      setDefContent(def.html || "No definition found.");
    } catch (err) {
      setDefContent("No definition found.");
    } finally {
      setDefOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistory((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  return (
    <PageShell
      title="History"
      actions={
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearAll}
          disabled={!history.length}
          sx={{ "&:hover": { color: "#FFFFFF" } }}
        >
          Clear History
        </Button>
      }
    >
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ border: "1px solid #E8DED2", overflow: "hidden" }}>
        <List>
          {!loading && history.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No history yet"
                secondary="Your chat lookups will appear here for this browser session."
              />
            </ListItem>
          )}

          {history.map((item) => {
            const lookupText = item.result?.definition?.word || item.query;
            const isDictionaryLookup = item.intent === "define" || item.intent === "example";

            return (
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
                    isDictionaryLookup ? (
                      <span>
                        {lookupText.split(" ").map((word, idx) => (
                          <React.Fragment key={`${word}-${idx}`}>
                            <span
                              style={{
                                cursor: "pointer",
                                color: "#B38762",
                                textDecoration: "underline",
                              }}
                              onClick={() => handleWordClick(word)}
                            >
                              {word}
                            </span>{" "}
                          </React.Fragment>
                        ))}
                      </span>
                    ) : (
                      <span>{item.query}</span>
                    )
                  }
                  secondary={item.intent}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      <Dialog open={defOpen} onClose={() => setDefOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Word Definition</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: defContent }} />
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default History;
