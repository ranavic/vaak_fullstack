import urllib.request
import json
import traceback

def test():
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/chat/message",
        data=json.dumps({"text": "hello"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as res:
            print("STATUS:", res.getcode())
            print("BODY:", res.read().decode("utf-8"))
    except Exception as e:
        print("ERROR:", str(e))
        traceback.print_exc()

if __name__ == "__main__":
    test()
