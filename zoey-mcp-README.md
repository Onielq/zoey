# zoey-mcp-server

An MCP server for the Zoey OS local backend (`zoey_backend.mjs`). It lets Claude check status, chat with Zoey, test provider keys, and read or create Google Calendar events.

## Setup

```bash
npm install
npm run build
```

Start your Zoey backend first (`node zoey_backend.mjs`, default port 8787).

## Connect it to Claude Desktop

Add this to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "zoey": {
      "command": "node",
      "args": ["/absolute/path/to/zoey-mcp-server/dist/index.js"],
      "env": {
        "ZOEY_BACKEND_URL": "http://127.0.0.1:8787",
        "ZOEY_SESSION_ID": "paste-your-browser-session-id"
      }
    }
  }
}
```

## The session id (important)

The backend keeps API keys and Google tokens in memory, per session. A new MCP connection gets a new, empty session. So it has no keys and no Google login.

To reuse what you saved in the Zoey UI, open the UI, open the browser console, and run:

```js
localStorage.getItem('zoeyBackendSession')
```

Paste that value into `ZOEY_SESSION_ID`. Treat it like a password.

The id stops working when the backend restarts. Copy a fresh one then. `zoey_get_status` tells you if the session was replaced.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `ZOEY_BACKEND_URL` | `http://127.0.0.1:8787` | Where the backend runs |
| `ZOEY_SESSION_ID` | none | Browser session to share |

## Tools

| Tool | Reads/writes | What it does |
|---|---|---|
| `zoey_get_status` | read | Providers with saved keys, Google status, session info. Never returns keys. |
| `zoey_chat` | writes chat memory | Send Zoey one message. Routes to OpenAI, falls back to Gemini. |
| `zoey_test_provider` | read | Test a key already saved on the session. |
| `zoey_calendar_today` | read | Today's events from the primary Google Calendar. |
| `zoey_calendar_create_event` | write | Create one event. Each call adds a new event. |

## What it leaves out on purpose

- **Saving API keys.** Keys typed into a chat get logged. Save them in the Zoey UI.
- **Voice / text-to-speech.** It returns a large base64 audio file, which is useless to a text client.
- **Skills, Workflows, Plugins, Tools, Share.** In the current UI these are static data. The backend has no endpoints for them. Add endpoints first, then add tools.

## Known backend limits

- Event times are fixed to `Africa/Kigali` (UTC+2) in the backend. The tool says so.
- Sessions live in memory. A backend restart clears keys and Google login.
