import urllib.request
import json
import traceback

def test():
    req = urllib.request.Request(
        "https://vaak-backend.onrender.com/api/chat/message",
        data=json.dumps({"text": "hello"}).encode("utf-8"),
        headers={"Content-Type": "application/json", "Origin": "https://vaakfrontend.vercel.app"}
    )
    try:
        with urllib.request.urlopen(req) as res:
            print("STATUS:", res.getcode())
            print("HEADERS:", res.headers)
            print("BODY:", res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print("HTTP ERROR:", e.code)
        print("HEADERS:", e.headers)
        print("BODY:", e.read().decode("utf-8"))
    except Exception as e:
        print("ERROR:", str(e))
        traceback.print_exc()

if __name__ == "__main__":
    test()
