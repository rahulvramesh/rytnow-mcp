# Configuration Guide

Complete guide for configuring Rytnow MCP Server with various AI assistants.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting an API Token](#getting-an-api-token)
- [Claude Code Configuration](#claude-code-configuration)
- [Cursor Configuration](#cursor-configuration)
- [Environment Variables](#environment-variables)
- [Production Setup](#production-setup)

---

## Prerequisites

1. **Node.js 18+** installed
2. **Rytnow account** with at least one workspace
3. **API token** generated from Rytnow

---

## Getting an API Token

### Option 1: Web UI

1. Log in to Rytnow
2. Go to **Settings** → **API Tokens**
3. Click **Generate New Token**
4. Give it a name (e.g., "Claude Code")
5. Copy the token immediately (it won't be shown again)

### Option 2: API Request

```bash
curl -X POST https://rytnow.me/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "your-password",
    "device_name": "claude-code"
  }'
```

Response:
```json
{
  "token": "1|abc123..."
}
```

---

## Claude Code Configuration

### Global Configuration

Edit `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "rytnow": {
      "command": "node",
      "args": ["/absolute/path/to/rytnow-mcp/dist/index.js"],
      "env": {
        "RYTNOW_API_URL": "https://rytnow.me/api/v1",
        "RYTNOW_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Project-Specific Configuration

Create `.claude/settings.json` in your project root:

```json
{
  "mcpServers": {
    "rytnow": {
      "command": "node",
      "args": ["/absolute/path/to/rytnow-mcp/dist/index.js"],
      "env": {
        "RYTNOW_API_URL": "https://rytnow.me/api/v1",
        "RYTNOW_API_TOKEN": "project-specific-token"
      }
    }
  }
}
```

### Local Development Configuration

For local Rytnow development:

```json
{
  "mcpServers": {
    "rytnow": {
      "command": "node",
      "args": ["/home/user/rytnow-mcp/dist/index.js"],
      "env": {
        "RYTNOW_API_URL": "http://localhost:8000/api/v1",
        "RYTNOW_API_TOKEN": "your-local-token"
      }
    }
  }
}
```

### Using npx (No Installation)

```json
{
  "mcpServers": {
    "rytnow": {
      "command": "npx",
      "args": ["-y", "rytnow-mcp"],
      "env": {
        "RYTNOW_API_URL": "https://rytnow.me/api/v1",
        "RYTNOW_API_TOKEN": "your-token"
      }
    }
  }
}
```

---

## Cursor Configuration

### Global Settings

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Search for "MCP"
3. Add to `mcp.servers`:

```json
{
  "rytnow": {
    "command": "node",
    "args": ["/path/to/rytnow-mcp/dist/index.js"],
    "env": {
      "RYTNOW_API_URL": "https://rytnow.me/api/v1",
      "RYTNOW_API_TOKEN": "your-token"
    }
  }
}
```

### Workspace Settings

Create `.cursor/mcp.json` in your workspace:

```json
{
  "servers": {
    "rytnow": {
      "command": "node",
      "args": ["/path/to/rytnow-mcp/dist/index.js"],
      "env": {
        "RYTNOW_API_URL": "https://rytnow.me/api/v1",
        "RYTNOW_API_TOKEN": "your-token"
      }
    }
  }
}
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RYTNOW_API_URL` | No | `http://localhost:8000/api/v1` | Rytnow API base URL |
| `RYTNOW_API_TOKEN` | **Yes** | - | Your Rytnow API token |

### Setting Environment Variables

#### In Configuration (Recommended)

Use the `env` field in your MCP configuration as shown above.

#### Shell Environment

```bash
export RYTNOW_API_URL="https://rytnow.me/api/v1"
export RYTNOW_API_TOKEN="your-token"
```

#### .env File (Development)

Create `.env` in the rytnow-mcp directory:

```env
RYTNOW_API_URL=http://localhost:8000/api/v1
RYTNOW_API_TOKEN=your-local-token
```

---

## Production Setup

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start the server
pm2 start /path/to/rytnow-mcp/dist/index.js \
  --name rytnow-mcp \
  --env RYTNOW_API_URL=https://rytnow.me/api/v1 \
  --env RYTNOW_API_TOKEN=your-token

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t rytnow-mcp .
docker run -d \
  -e RYTNOW_API_URL=https://rytnow.me/api/v1 \
  -e RYTNOW_API_TOKEN=your-token \
  --name rytnow-mcp \
  rytnow-mcp
```

### Security Best Practices

1. **Never commit tokens** - Use environment variables or secure vaults
2. **Use minimal permissions** - Create tokens with only needed access
3. **Rotate tokens regularly** - Generate new tokens periodically
4. **Audit token usage** - Monitor API calls in Rytnow logs
5. **Revoke unused tokens** - Delete tokens you no longer need

---

## Verifying Configuration

### Check MCP Server is Running

After configuring, restart your AI assistant and try:

```
"List my workspaces"
```

If configured correctly, you should see your Rytnow workspaces.

### Debug Mode

Run the server manually to see debug output:

```bash
RYTNOW_API_URL=https://rytnow.me/api/v1 \
RYTNOW_API_TOKEN=your-token \
node /path/to/rytnow-mcp/dist/index.js
```

Check stderr for connection messages.

### Common Issues

1. **"RYTNOW_API_TOKEN environment variable is required"**
   - Token not set in configuration
   - Check spelling of environment variable

2. **"401 Unauthorized"**
   - Token is invalid or expired
   - Generate a new token

3. **"Connection refused"**
   - API URL is incorrect
   - Server is not running (for local development)

4. **"ENOENT: no such file or directory"**
   - Path to dist/index.js is wrong
   - Run `npm run build` to create dist folder
