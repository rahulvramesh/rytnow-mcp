import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getApiClient, RytnowApiClient } from "../api-client.js";

export function registerCommentTools(server: McpServer) {
  const api = getApiClient();

  // List comments
  server.tool(
    "list_comments",
    "List all comments on a task",
    {
      task_id: z.number().describe("The task ID"),
    },
    async ({ task_id }) => {
      try {
        const result = await api.listComments(task_id);
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

  // Add comment
  server.tool(
    "add_comment",
    "Add a comment to a task",
    {
      task_id: z.number().describe("The task ID"),
      content: z.string().min(1).describe("Comment content (supports markdown)"),
    },
    async ({ task_id, content }) => {
      try {
        const result = await api.addComment(task_id, content);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Comment added",
                comment: result.data,
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
