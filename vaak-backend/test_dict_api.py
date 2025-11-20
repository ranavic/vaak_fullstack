import httpx

async def test_dictionary_api():
    url = "https://api.dictionaryapi.dev/api/v2/entries/en/hello"
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(url)
            print(f"Status code: {r.status_code}")
            if r.status_code == 200:
                print("Response JSON:")
                print(r.json())
            else:
                print("Response text:")
                print(r.text)
        except httpx.RequestError as e:
            print(f"An error occurred while requesting {e.request.url!r}.")
            print(e)

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_dictionary_api())
