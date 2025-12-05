# Usage Examples

Real-world examples of using Rytnow MCP Server with AI assistants.

## Table of Contents

- [Getting Started](#getting-started)
- [Task Management Workflows](#task-management-workflows)
- [Time Tracking Workflows](#time-tracking-workflows)
- [Planning Workflows](#planning-workflows)
- [Reporting Workflows](#reporting-workflows)
- [Automation Examples](#automation-examples)

---

## Getting Started

### First Steps

```
User: "What workspaces do I have access to?"

AI: [Uses list_workspaces]
You have access to 2 workspaces:
1. "Personal Projects" (ID: 1) - 3 projects
2. "Acme Corp" (ID: 2) - 7 projects
```

```
User: "Show me the projects in Acme Corp"

AI: [Uses list_projects with workspace_id: 2]
Acme Corp has 7 projects:
- API Backend (active) - 45 tasks, 12 completed
- Mobile App (active) - 32 tasks, 8 completed
- Website Redesign (on_hold) - 28 tasks
...
```

---

## Task Management Workflows

### Creating Tasks

```
User: "Create a task to fix the login timeout issue with high priority"

AI: [Uses create_task]
Created task WEB-47: "Fix the login timeout issue"
- Priority: High
- Status: Todo
- Project: Website Redesign
```

```
User: "Add a task 'Update user documentation' assigned to john@acme.com,
       due next Friday, estimated 4 hours"

AI: [Uses get_workspace_members to find John's ID, then create_task]
Created task API-156: "Update user documentation"
- Assigned to: John Doe
- Due: 2024-12-13
- Estimated: 4 hours
```

### Managing Task Status

```
User: "I'm starting work on task API-156"

AI: [Uses update_task_status with status: "in_progress"]
Task API-156 moved to "In Progress"
```

```
User: "Mark API-156 as done and create a follow-up task for testing"

AI: [Uses update_task_status, then create_task]
✓ Task API-156 marked as done
✓ Created task API-157: "Test updated user documentation"
```

### Working with Subtasks

```
User: "Break down task API-160 into subtasks for each API endpoint"

AI: [Uses create_subtask multiple times]
Added 4 subtasks to API-160:
□ Implement GET /users endpoint
□ Implement POST /users endpoint
□ Implement PUT /users endpoint
□ Implement DELETE /users endpoint
```

```
User: "Mark the GET endpoint subtask as done"

AI: [Uses toggle_subtask]
✓ Subtask "Implement GET /users endpoint" completed
Progress: 1/4 subtasks done
```

### Bulk Operations

```
User: "Move all high priority tasks in the API project to in_progress"

AI: [Uses list_tasks to find tasks, then update_task_status for each]
Updated 5 tasks to "In Progress":
- API-45: Fix authentication
- API-52: Add rate limiting
- API-67: Update error handling
- API-71: Implement caching
- API-89: Add logging
```

---

## Time Tracking Workflows

### Starting and Stopping Timers

```
User: "Start tracking time on the login bug fix"

AI: [Uses start_timer on task ID]
Timer started on WEB-47: "Fix the login timeout issue"
Started at: 10:30 AM
```

```
User: "Stop my current timer"

AI: [Uses stop_timer]
Timer stopped on WEB-47
Duration: 2h 15m
Total time on task: 4h 30m
```

### Logging Time Manually

```
User: "Log 3 hours on task API-156 for yesterday's code review"

AI: [Uses log_time with duration: 10800]
Logged 3h 0m on API-156
Description: Code review
```

```
User: "I spent 45 minutes in a meeting about API-160"

AI: [Uses log_time with duration: 2700]
Logged 45m on API-160
Description: Meeting
```

### Time Reports

```
User: "How much time have I logged on the API project this week?"

AI: [Uses list_tasks and list_time_entries for each]
Time logged on API Backend this week:
- API-156: 5h 30m
- API-160: 3h 15m
- API-167: 2h 0m
Total: 10h 45m
```

---

## Planning Workflows

### Creating Plans

```
User: "Create a plan for implementing OAuth authentication"

AI: [Uses create_plan]
Created plan "OAuth Authentication Implementation"
- Status: Draft
- Project: API Backend

Would you like me to add some tasks to this plan?
```

### Linking Tasks to Plans

```
User: "Link all authentication-related tasks to the OAuth plan"

AI: [Uses list_tasks to find tasks, then link_task_to_plan for each]
Linked 4 tasks to "OAuth Authentication":
- API-45: Implement OAuth provider
- API-46: Add token refresh
- API-47: Create login flow
- API-48: Add logout handling

Plan progress: 0% (0/4 tasks completed)
```

### Plan Progress Tracking

```
User: "What's the status of our OAuth implementation plan?"

AI: [Uses get_plan]
Plan: OAuth Authentication
Status: Active
Progress: 50% (2/4 tasks completed)

Completed:
✓ API-45: Implement OAuth provider
✓ API-46: Add token refresh

In Progress:
◐ API-47: Create login flow

Todo:
○ API-48: Add logout handling

Target Date: December 15, 2024
```

### Completing Plans

```
User: "Mark the OAuth plan as completed"

AI: [Uses update_plan_status with status: "completed"]
Plan "OAuth Authentication" marked as completed!
Final stats:
- 4/4 tasks completed
- Completed 2 days ahead of schedule
```

---

## Reporting Workflows

### Project Overview

```
User: "Give me an overview of the Website Redesign project"

AI: [Uses get_project and list_tasks]
Website Redesign (WEB)
Status: Active

Task Summary:
- Todo: 12 tasks
- In Progress: 5 tasks
- Done: 28 tasks
Total Progress: 62%

High Priority Tasks:
1. WEB-47: Fix login timeout (in_progress)
2. WEB-52: Update checkout flow (todo)
3. WEB-58: Mobile responsive issues (in_progress)
```

### Workload Analysis

```
User: "What's John working on right now?"

AI: [Uses list_tasks with assigned_to filter]
John's Current Tasks:

In Progress (3):
- API-156: Update documentation (4h estimated)
- WEB-52: Update checkout flow (6h estimated)
- MOB-34: Fix push notifications (2h estimated)

Todo (5):
- API-160: Implement new endpoints
...

Total estimated: 24 hours
```

### Blockers and Issues

```
User: "What high priority tasks are still in todo status?"

AI: [Uses list_tasks with status and priority filters]
High Priority Todo Tasks:

API Backend:
- API-89: Add request logging (no assignee)
- API-92: Fix memory leak (assigned: Jane)

Website:
- WEB-52: Update checkout flow (assigned: John)

Recommendation: API-89 needs to be assigned.
```

---

## Automation Examples

### Daily Standup Preparation

```
User: "Prepare my daily standup"

AI: [Uses multiple tools to gather data]
📋 Daily Standup - December 5, 2024

Yesterday:
- ✅ Completed WEB-47: Fix login timeout (2h 15m)
- ✅ Completed API-156: Update documentation (3h)

Today:
- 🔄 Continue WEB-52: Update checkout flow
- 📝 Start API-160: Implement new endpoints

Blockers:
- Waiting for design review on WEB-58

Time logged yesterday: 5h 15m
```

### Sprint Planning Assistant

```
User: "Help me plan the next sprint for the API project"

AI: [Uses list_tasks and list_plans]
Sprint Planning for API Backend

Suggested tasks (by priority):
High Priority (must include):
1. API-89: Add request logging - 3 points
2. API-92: Fix memory leak - 5 points

Medium Priority (should include):
3. API-95: Implement rate limiting - 5 points
4. API-98: Add metrics endpoint - 3 points

Total story points: 16

Based on last sprint velocity (18 points), you have
capacity for 1-2 additional medium priority tasks.

Would you like me to create a plan for this sprint?
```

### End of Day Summary

```
User: "Summarize my work today and log off"

AI: [Uses list_time_entries and stop_timer if running]
📊 Daily Summary - December 5, 2024

Tasks Worked On:
- WEB-52: Update checkout flow (3h 30m)
- API-160: Implement new endpoints (2h 15m)

Tasks Completed:
- ✅ WEB-47: Fix login timeout

Total Time: 5h 45m

Comments Added: 3
Subtasks Completed: 4

Timer stopped. Have a great evening! 🌙
```

---

## Tips and Best Practices

### Efficient Queries

1. **Be specific with project context**
   ```
   Good: "List high priority tasks in the API project"
   Less efficient: "List all tasks" then filter manually
   ```

2. **Use natural references**
   ```
   "Mark WEB-47 as done" works if you know the short code
   ```

3. **Chain operations**
   ```
   "Create a task for bug fix and start tracking time on it"
   ```

### Task Organization

1. **Use consistent naming**
   ```
   "Fix: Login timeout issue"
   "Feature: Add dark mode"
   "Docs: Update API reference"
   ```

2. **Set estimates for planning**
   ```
   "Create a 4-hour task for the refactoring work"
   ```

3. **Link to plans for visibility**
   ```
   "Link this task to the Q4 release plan"
   ```

### Time Tracking

1. **Always add descriptions**
   ```
   "Log 2 hours for code review and PR feedback"
   ```

2. **Start timers when beginning work**
   ```
   "I'm starting on task X" will automatically start tracking
   ```

3. **Stop timers before switching**
   ```
   Starting a new timer automatically stops the previous one
   ```
