# Rytnow MCP Server

An MCP (Model Context Protocol) server that exposes [Rytnow](https://rytnow.me) project management capabilities to AI assistants like Claude Code.

## Features

- **Workspace & Project Navigation**: List workspaces, projects, and team members
- **Task Management**: Create, update, and manage tasks with full CRUD support
- **Plan Management**: Create feature plans and link tasks to them
- **Time Tracking**: Start/stop timers and log time entries
- **Comments**: Add and list task comments
- **Subtasks**: Create and manage task subtasks

## Installation

```bash
# Clone the repository
git clone https://github.com/rahulvramesh/rytnow-mcp.git
cd rytnow-mcp

# Install dependencies
npm install

# Build
npm run build
```

## Configuration

### 1. Generate an API Token

Get your Rytnow API token from:
- **Web UI**: Go to Settings → API Tokens → Generate New Token
- **API**: `POST /api/v1/auth/token` with email and password

### 2. Configure Claude Code

Add to your Claude Code configuration file (`~/.claude/config.json` or `.claude/settings.json`):

```json
{
  "mcpServers": {
    "rytnow": {
      "command": "node",
      "args": ["/path/to/rytnow-mcp/dist/index.js"],
      "env": {
        "RYTNOW_API_URL": "https://rytnow.me/api/v1",
        "RYTNOW_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

For local development:
```json
{
  "mcpServers": {
    "rytnow": {
      "command": "node",
      "args": ["/path/to/rytnow-mcp/dist/index.js"],
      "env": {
        "RYTNOW_API_URL": "http://localhost:8000/api/v1",
        "RYTNOW_API_TOKEN": "your-local-token"
      }
    }
  }
}
```

## Available Tools

### Workspace & Projects

| Tool | Description |
|------|-------------|
| `list_workspaces` | List all accessible workspaces |
| `get_workspace` | Get workspace details |
| `get_workspace_members` | List workspace members |
| `list_projects` | List projects in a workspace |
| `get_project` | Get project details |
| `list_labels` | List project labels |

### Tasks

| Tool | Description |
|------|-------------|
| `list_tasks` | List tasks with filters (status, priority, assignee) |
| `get_task` | Get full task details with subtasks and comments |
| `create_task` | Create a new task |
| `update_task` | Update task fields |
| `update_task_status` | Change task status (todo → in_progress → done) |
| `list_subtasks` | List task subtasks |
| `create_subtask` | Create a subtask |
| `toggle_subtask` | Toggle subtask completion |

### Plans

| Tool | Description |
|------|-------------|
| `list_plans` | List project plans |
| `get_plan` | Get plan with linked tasks |
| `create_plan` | Create a new plan |
| `update_plan_status` | Change plan status |
| `link_task_to_plan` | Link a task to a plan |
| `unlink_task_from_plan` | Unlink a task from a plan |

### Time Tracking

| Tool | Description |
|------|-------------|
| `list_time_entries` | List time entries for a task |
| `start_timer` | Start time tracking |
| `stop_timer` | Stop running timer |
| `log_time` | Log manual time entry |

### Comments

| Tool | Description |
|------|-------------|
| `list_comments` | List task comments |
| `add_comment` | Add a comment to a task |

## Available Resources

| URI | Description |
|-----|-------------|
| `rytnow://workspaces` | List of all workspaces |
| `rytnow://workspace/{id}` | Workspace details |
| `rytnow://workspace/{id}/projects` | Projects in workspace |
| `rytnow://project/{id}/tasks` | Tasks in project |
| `rytnow://project/{id}/plans` | Plans in project |

## Usage Examples

Once configured, you can use natural language in Claude Code:

```
"List all my workspaces"
"Show me tasks in project 1"
"Create a task called 'Fix login bug' with high priority"
"Start timer on task 123"
"Mark task 123 as done"
"Create a plan for the authentication feature"
```

## Development

```bash
# Run in development mode (with hot reload)
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RYTNOW_API_URL` | Rytnow API base URL | `http://localhost:8000/api/v1` |
| `RYTNOW_API_TOKEN` | Your API authentication token | Required |

## License

MIT
