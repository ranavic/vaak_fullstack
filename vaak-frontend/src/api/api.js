import axiosClient from "./axiosClient";

// Fetch translation
export async function fetchTranslation(text, targetLang, sourceLang = "auto") {
  try {
    const payload = {
      text,
      target_lang: targetLang,
    };

    // Only include source_lang if it's not auto (backend will handle detection)
    if (sourceLang && sourceLang !== "auto") {
      payload.source_lang = sourceLang;
    }

    const res = await axiosClient.post("/api/translate/", payload);
    return res.data;
  } catch (error) {
    console.error("Translation API error:", error);
    throw error;
  }
}


// Fetch all languages
export async function fetchLanguages() {
  try {
    const res = await axiosClient.get("/api/translate/languages");
    return res.data;
  } catch (error) {
    console.error("Languages API error:", error);
    throw error;
  }
}

// Fetch user profile
export async function fetchUserProfile(userId) {
  try {
    const res = await axiosClient.get(`/users/${userId}`);
    return res.data;
  } catch (error) {
        throw error;
      }
    }
    
    // Send chat message

// Send chat message
export async function sendChatMessage(text) {
  try {
    const res = await axiosClient.post("/api/chat/message", { text });
    return res.data;
  } catch (error) {
    console.error("Chat API error:", error);
    throw error;
  }
}

// Fetch dictionary definition
export async function fetchDictionaryDefinition(word) {
  try {
    const res = await axiosClient.get(`/api/dict/define/${word}`);
    return res.data;
  } catch (error) {
    console.error("Dictionary API error:", error);
    throw error;
  }
}

// Fetch dictionary example
export async function fetchDictionaryExample(word) {
  try {
    const res = await axiosClient.get(`/api/dict/example/${word}`);
    return res.data;
  } catch (error) {
    console.error("Dictionary Example API error:", error);
    throw error;
  }
}
