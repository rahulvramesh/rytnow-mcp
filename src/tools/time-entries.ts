import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getApiClient, RytnowApiClient } from "../api-client.js";

export function registerTimeEntryTools(server: McpServer) {
  const api = getApiClient();

  // List time entries
  server.tool(
    "list_time_entries",
    "List all time entries for a task",
    {
      task_id: z.number().describe("The task ID"),
    },
    async ({ task_id }) => {
      try {
        const result = await api.listTimeEntries(task_id);
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

  // Start timer
  server.tool(
    "start_timer",
    "Start time tracking on a task. Will stop any other running timer.",
    {
      task_id: z.number().describe("The task ID to start tracking"),
      description: z.string().optional().describe("Optional description of what you're working on"),
    },
    async ({ task_id, description }) => {
      try {
        const result = await api.startTimer(task_id, description);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Timer started",
                time_entry: result.data,
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

  // Stop timer
  server.tool(
    "stop_timer",
    "Stop the currently running timer on a task",
    {
      task_id: z.number().describe("The task ID to stop tracking"),
    },
    async ({ task_id }) => {
      try {
        const result = await api.stopTimer(task_id);
        const duration = result.data.duration;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Timer stopped. Duration: ${timeStr}`,
                time_entry: result.data,
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

  // Log time manually
  server.tool(
    "log_time",
    "Log a manual time entry for a task",
    {
      task_id: z.number().describe("The task ID"),
      duration: z.number().describe("Duration in seconds"),
      description: z.string().optional().describe("Description of work done"),
      started_at: z.string().optional().describe("Start time in ISO format (defaults to now minus duration)"),
    },
    async ({ task_id, duration, description, started_at }) => {
      try {
        const result = await api.logTime(task_id, { duration, description, started_at });
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Logged ${timeStr} of time`,
                time_entry: result.data,
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
