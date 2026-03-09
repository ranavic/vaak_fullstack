from fastapi.testclient import TestClient
from app.main import app
from app.db.mongo import history_collection

client = TestClient(app)

def test_routes():
    # Test chat - simple greeting
    print("Testing chat simple message...")
    response = client.post("/api/chat/message", json={"text": "hello"})
    print(response.status_code, response.json())

    # Test chat - define
    print("\nTesting chat define...")
    response = client.post("/api/chat/message", json={"text": "meaning of serendipity"})
    print(response.status_code, response.json())
    
    # Test chat - translate
    print("\nTesting chat translate...")
    response = client.post("/api/chat/message", json={"text": "hello in spanish"})
    print(response.status_code, response.json())

    # Test history
    print("\nTesting history GET...")
    response = client.get("/api/chat/history")
    print(response.status_code, response.json())

if __name__ == "__main__":
    test_routes()
