import fs from "fs";

async function testApi() {
  fs.writeFileSync("out_prod.txt", "Testing production API...\n");
  try {
    const res = await fetch("https://vaak-backend.onrender.com/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://vaakfrontend.vercel.app"
      },
      body: JSON.stringify({ text: "meaning of serendipity" })
    });
    
    fs.appendFileSync("out_prod.txt", "Status: " + res.status + "\n");
    
    const headers = Array.from(res.headers.entries()).map(([k, v]) => `${k}: ${v}`).join("\n");
    fs.appendFileSync("out_prod.txt", "Headers:\n" + headers + "\n");
    
    const data = await res.text();
    fs.appendFileSync("out_prod.txt", "Body: " + data + "\n");
  } catch (err) {
    fs.appendFileSync("out_prod.txt", "Error: " + err.toString() + "\n");
  }
}

testApi();
