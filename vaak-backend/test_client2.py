import sys
import traceback

with open("test_output.txt", "w") as f:
    try:
        f.write("Starting tests...\n")
        f.flush()
        from fastapi.testclient import TestClient
        from app.main import app
        
        f.write("App imported.\n")
        f.flush()

        client = TestClient(app)
        
        f.write("Testing chat simple message...\n")
        f.flush()
        response = client.post("/api/chat/message", json={"text": "hello"})
        f.write(f"Status: {response.status_code}\n")
        f.write(f"Response: {response.text}\n")
        
        f.write("\nTesting chat fallback...\n")
        response = client.post("/api/chat/message", json={"text": "random stuff clearly chat"})
        f.write(f"Status: {response.status_code}\n")
        f.write(f"Response: {response.text}\n")

    except Exception as e:
        f.write("Error occurred:\n")
        traceback.print_exc(file=f)
