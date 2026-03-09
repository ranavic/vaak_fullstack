const fetch = require('node-fetch');

async function testApi() {
  console.log("Testing production API...");
  try {
    const res = await fetch("https://vaak-backend.onrender.com/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://vaakfrontend.vercel.app"
      },
      body: JSON.stringify({ text: "meaning of serendipity" })
    });
    console.log("Status:", res.status);
    const data = await res.text();
    console.log("Body:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testApi();
