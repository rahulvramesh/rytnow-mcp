import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getApiClient, RytnowApiClient } from "../api-client.js";

export function registerTaskTools(server: McpServer) {
  const api = getApiClient();

  // List tasks
  server.tool(
    "list_tasks",
    "List tasks in a project with optional filters",
    {
      project_id: z.number().describe("The project ID"),
      status: z.enum(["todo", "in_progress", "done"]).optional().describe("Filter by task status"),
      priority: z.enum(["low", "medium", "high"]).optional().describe("Filter by priority"),
      assigned_to: z.number().optional().describe("Filter by assignee user ID"),
      per_page: z.number().optional().default(25).describe("Number of tasks per page (default 25)"),
    },
    async ({ project_id, status, priority, assigned_to, per_page }) => {
      try {
        const result = await api.listTasks(project_id, { status, priority, assigned_to, per_page });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${RytnowApiClient.formatError(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get task details
  server.tool(
    "get_task",
    "Get full details of a task including subtasks and comments",
    {
      project_id: z.number().describe("The project ID"),
      task_id: z.number().describe("The task ID"),
    },
    async ({ project_id, task_id }) => {
      try {
        const result = await api.getTask(project_id, task_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${RytnowApiClient.formatError(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create task
  server.tool(
    "create_task",
    "Create a new task in a project",
    {
      project_id: z.number().describe("The project ID"),
      title: z.string().min(1).describe("Task title"),
      description: z.string().optional().describe("Task description (supports markdown)"),
      priority: z.enum(["low", "medium", "high"]).optional().default("medium").describe("Task priority"),
      assigned_to: z.number().optional().describe("User ID to assign the task to"),
      estimated_hours: z.number().optional().describe("Estimated hours to complete"),
      due_date: z.string().optional().describe("Due date in YYYY-MM-DD format"),
      story_points: z.number().optional().describe("Story points estimate"),
    },
    async ({ project_id, title, description, priority, assigned_to, estimated_hours, due_date, story_points }) => {
      try {
        const result = await api.createTask(project_id, {
          title,
          description,
          priority,
          assigned_to,
          estimated_hours,
          due_date,
          story_points,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Task created: ${result.data.short_code}`,
                task: result.data,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${RytnowApiClient.formatError(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update task
  server.tool(
    "update_task",
    "Update an existing task",
    {
      project_id: z.number().describe("The project ID"),
      task_id: z.number().describe("The task ID"),
      title: z.string().optional().describe("New task title"),
      description: z.string().optional().describe("New task description"),
      priority: z.enum(["low", "medium", "high"]).optional().describe("New priority"),
      assigned_to: z.number().nullable().optional().describe("New assignee (null to unassign)"),
      estimated_hours: z.number().nullable().optional().describe("New estimated hours"),
      due_date: z.string().nullable().optional().describe("New due date (null to clear)"),
      story_points: z.number().nullable().optional().describe("New story points"),
    },
    async ({ project_id, task_id, ...updates }) => {
      try {
        const result = await api.updateTask(project_id, task_id, updates);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Task ${result.data.short_code} updated`,
                task: result.data,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${RytnowApiClient.formatError(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Update task status
  server.tool(
    "update_task_status",
    "Change the status of a task (todo, in_progress, done)",
    {
      project_id: z.number().describe("The project ID"),
      task_id: z.number().describe("The task ID"),
      status: z.enum(["todo", "in_progress", "done"]).describe("New status"),
    },
    async ({ project_id, task_id, status }) => {
      try {
        const result = await api.updateTaskStatus(project_id, task_id, status);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Task status changed to ${status}`,
                task: result.data,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${RytnowApiClient.formatError(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // List subtasks
  server.tool(
    "list_subtasks",
    "List all subtasks of a task",
    {
      task_id: z.number().describe("The parent task ID"),
    },
    async ({ task_id }) => {
      try {
        const result = await api.listSubtasks(task_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${RytnowApiClient.formatError(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Create subtask
  server.tool(
    "create_subtask",
    "Create a new subtask under a task",
    {
      task_id: z.number().describe("The parent task ID"),
      title: z.string().min(1).describe("Subtask title"),
      assigned_to: z.number().optional().describe("User ID to assign"),
    },
    async ({ task_id, title, assigned_to }) => {
      try {
        const result = await api.createSubtask(task_id, { title, assigned_to });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Subtask created",
                subtask: result.data,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${RytnowApiClient.formatError(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Toggle subtask completion
  server.tool(
    "toggle_subtask",
    "Toggle completion status of a subtask",
    {
      task_id: z.number().describe("The parent task ID"),
      subtask_id: z.number().describe("The subtask ID"),
    },
    async ({ task_id, subtask_id }) => {
      try {
        const result = await api.toggleSubtask(task_id, subtask_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Subtask ${result.data.is_completed ? "completed" : "uncompleted"}`,
                subtask: result.data,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${RytnowApiClient.formatError(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
