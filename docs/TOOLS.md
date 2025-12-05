# Tool Reference

Complete reference for all available MCP tools in Rytnow MCP Server.

## Table of Contents

- [Workspace Tools](#workspace-tools)
- [Project Tools](#project-tools)
- [Task Tools](#task-tools)
- [Plan Tools](#plan-tools)
- [Time Tracking Tools](#time-tracking-tools)
- [Comment Tools](#comment-tools)
- [Resource Tools](#resource-tools)

---

## Workspace Tools

### list_workspaces

List all workspaces the authenticated user has access to.

**Parameters:** None

**Returns:**
```json
[
  {
    "id": 1,
    "name": "My Workspace",
    "description": "Main workspace",
    "color": "#3B82F6",
    "owner_id": 1,
    "projects_count": 5,
    "members_count": 3
  }
]
```

**Example:**
```
"List all my workspaces"
```

---

### get_workspace

Get detailed information about a specific workspace.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `workspace_id` | number | Yes | The workspace ID |

**Returns:** Workspace object with projects list

**Example:**
```
"Get details for workspace 1"
```

---

### get_workspace_members

List all members of a workspace.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `workspace_id` | number | Yes | The workspace ID |

**Returns:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "owner",
    "joined_at": "2024-01-15T10:00:00Z"
  }
]
```

**Example:**
```
"Who are the members of workspace 1?"
```

---

## Project Tools

### list_projects

List all projects in a workspace.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `workspace_id` | number | Yes | The workspace ID |
| `status` | string | No | Filter: `active`, `on_hold`, `completed`, `archived` |
| `search` | string | No | Search by project name |

**Returns:**
```json
[
  {
    "id": 1,
    "name": "Website Redesign",
    "key": "WEB",
    "status": "active",
    "description": "Redesign the company website",
    "tasks_count": 24,
    "completed_tasks_count": 10
  }
]
```

**Example:**
```
"List active projects in workspace 1"
"Search for projects with 'api' in workspace 1"
```

---

### get_project

Get detailed project information including task summary.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `workspace_id` | number | Yes | The workspace ID |
| `project_id` | number | Yes | The project ID |

**Returns:** Full project object with statistics

**Example:**
```
"Get project 5 from workspace 1"
```

---

### list_labels

List all labels defined in a project.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |

**Returns:**
```json
[
  {
    "id": 1,
    "name": "bug",
    "color": "#EF4444",
    "tasks_count": 8
  }
]
```

**Example:**
```
"What labels are available in project 1?"
```

---

## Task Tools

### list_tasks

List tasks in a project with optional filtering.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `status` | string | No | Filter: `todo`, `in_progress`, `done` |
| `priority` | string | No | Filter: `low`, `medium`, `high` |
| `assigned_to` | number | No | Filter by assignee user ID |
| `per_page` | number | No | Results per page (default: 25) |

**Returns:**
```json
[
  {
    "id": 1,
    "short_code": "WEB-1",
    "title": "Fix navigation bug",
    "status": "in_progress",
    "priority": "high",
    "assignee": {
      "id": 1,
      "name": "John Doe"
    },
    "due_date": "2024-12-10",
    "labels": [{"name": "bug", "color": "#EF4444"}]
  }
]
```

**Example:**
```
"List all high priority tasks in project 1"
"Show me in-progress tasks assigned to user 5"
"What tasks are due this week in project 2?"
```

---

### get_task

Get full task details including subtasks and comments.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `task_id` | number | Yes | The task ID |

**Returns:** Complete task object with:
- Task details
- Subtasks list
- Recent comments
- Time entries summary
- Labels

**Example:**
```
"Get details for task 123 in project 1"
"Show me WEB-45"
```

---

### create_task

Create a new task in a project.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `title` | string | Yes | Task title |
| `description` | string | No | Task description (supports markdown) |
| `priority` | string | No | `low`, `medium` (default), `high` |
| `assigned_to` | number | No | User ID to assign |
| `estimated_hours` | number | No | Estimated hours |
| `due_date` | string | No | Due date (YYYY-MM-DD) |
| `story_points` | number | No | Story points estimate |

**Returns:**
```json
{
  "success": true,
  "message": "Task created: WEB-46",
  "task": {
    "id": 46,
    "short_code": "WEB-46",
    "title": "Implement dark mode",
    "status": "todo",
    "priority": "medium"
  }
}
```

**Example:**
```
"Create a task 'Fix login bug' with high priority in project 1"
"Add a new task: 'Update documentation' assigned to user 3, due 2024-12-15"
```

---

### update_task

Update an existing task's fields.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `task_id` | number | Yes | The task ID |
| `title` | string | No | New title |
| `description` | string | No | New description |
| `priority` | string | No | New priority |
| `assigned_to` | number/null | No | New assignee (null to unassign) |
| `estimated_hours` | number/null | No | New estimate |
| `due_date` | string/null | No | New due date (null to clear) |
| `story_points` | number/null | No | New story points |

**Example:**
```
"Update task 45 priority to high"
"Change the due date of task 23 to 2024-12-20"
"Assign task 67 to user 5"
```

---

### update_task_status

Change the status of a task.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `task_id` | number | Yes | The task ID |
| `status` | string | Yes | `todo`, `in_progress`, `done` |

**Example:**
```
"Mark task 45 as done"
"Move task 23 to in progress"
"Set task 67 status to todo"
```

---

### list_subtasks

List all subtasks of a task.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The parent task ID |

**Returns:**
```json
[
  {
    "id": 1,
    "title": "Write unit tests",
    "is_completed": false,
    "assignee": null
  }
]
```

---

### create_subtask

Create a new subtask under a task.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The parent task ID |
| `title` | string | Yes | Subtask title |
| `assigned_to` | number | No | User ID to assign |

**Example:**
```
"Add subtask 'Write tests' to task 45"
```

---

### toggle_subtask

Toggle completion status of a subtask.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The parent task ID |
| `subtask_id` | number | Yes | The subtask ID |

**Example:**
```
"Mark subtask 12 as complete on task 45"
```

---

## Plan Tools

### list_plans

List all plans in a project.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `status` | string | No | Filter: `draft`, `active`, `on_hold`, `completed`, `cancelled` |

**Returns:**
```json
[
  {
    "id": 1,
    "title": "Authentication Feature",
    "status": "active",
    "tasks_count": 8,
    "completed_tasks_count": 3,
    "progress": 37,
    "target_date": "2024-12-31"
  }
]
```

---

### get_plan

Get plan details including linked tasks.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `plan_id` | number | Yes | The plan ID |

**Returns:** Complete plan with:
- Plan details and content
- Linked tasks list
- Progress statistics

---

### create_plan

Create a new plan in a project.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `title` | string | Yes | Plan title |
| `content` | string | No | Plan content (supports HTML) |
| `target_date` | string | No | Target date (YYYY-MM-DD) |
| `status` | string | No | `draft` (default) or `active` |

**Example:**
```
"Create a plan called 'User Authentication' in project 1"
"Add a new plan for the API refactoring with target date 2024-12-31"
```

---

### update_plan_status

Change the status of a plan.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `plan_id` | number | Yes | The plan ID |
| `status` | string | Yes | `draft`, `active`, `on_hold`, `completed`, `cancelled` |

**Example:**
```
"Mark plan 5 as completed"
"Put plan 3 on hold"
```

---

### link_task_to_plan

Link an existing task to a plan.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `plan_id` | number | Yes | The plan ID |
| `task_id` | number | Yes | The task ID to link |

**Example:**
```
"Link task 45 to plan 3 in project 1"
```

---

### unlink_task_from_plan

Remove a task from a plan.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project_id` | number | Yes | The project ID |
| `plan_id` | number | Yes | The plan ID |
| `task_id` | number | Yes | The task ID to unlink |

---

## Time Tracking Tools

### list_time_entries

List all time entries for a task.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The task ID |

**Returns:**
```json
[
  {
    "id": 1,
    "started_at": "2024-12-05T09:00:00Z",
    "stopped_at": "2024-12-05T11:30:00Z",
    "duration": 9000,
    "description": "Implemented login form",
    "user": {
      "id": 1,
      "name": "John Doe"
    }
  }
]
```

---

### start_timer

Start time tracking on a task. Automatically stops any running timer.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The task ID |
| `description` | string | No | What you're working on |

**Example:**
```
"Start timer on task 45"
"Start tracking time on task 23 - working on the API"
```

---

### stop_timer

Stop the running timer on a task.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The task ID |

**Returns:**
```json
{
  "success": true,
  "message": "Timer stopped. Duration: 2h 15m",
  "time_entry": {
    "duration": 8100
  }
}
```

**Example:**
```
"Stop timer on task 45"
```

---

### log_time

Log a manual time entry.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The task ID |
| `duration` | number | Yes | Duration in seconds |
| `description` | string | No | Work description |
| `started_at` | string | No | Start time (ISO format) |

**Example:**
```
"Log 2 hours on task 45" (use duration: 7200)
"Add 30 minutes of time to task 23 for code review"
```

**Duration Reference:**
- 15 minutes = 900 seconds
- 30 minutes = 1800 seconds
- 1 hour = 3600 seconds
- 2 hours = 7200 seconds

---

## Comment Tools

### list_comments

List all comments on a task.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The task ID |

**Returns:**
```json
[
  {
    "id": 1,
    "content": "This needs more testing",
    "user": {
      "id": 1,
      "name": "John Doe"
    },
    "created_at": "2024-12-05T10:30:00Z"
  }
]
```

---

### add_comment

Add a comment to a task.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `task_id` | number | Yes | The task ID |
| `content` | string | Yes | Comment content (supports markdown) |

**Example:**
```
"Add a comment to task 45: 'Fixed the bug, ready for review'"
"Comment on task 23: 'Need to discuss the approach with the team'"
```

---

## Resource Tools

### read_resource

Read a Rytnow resource by URI.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `uri` | string | Yes | Resource URI |

**Valid URIs:**
| URI | Description |
|-----|-------------|
| `rytnow://workspaces` | List all workspaces |
| `rytnow://workspace/{id}` | Workspace details |
| `rytnow://workspace/{id}/projects` | Projects in workspace |
| `rytnow://project/{id}/tasks` | Tasks in project |
| `rytnow://project/{id}/plans` | Plans in project |

**Example:**
```
"Read resource rytnow://project/1/tasks"
"Fetch rytnow://workspaces"
```
