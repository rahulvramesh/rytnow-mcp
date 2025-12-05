import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getApiClient, RytnowApiClient } from "../api-client.js";

export function registerWorkspaceTools(server: McpServer) {
  const api = getApiClient();

  // List all workspaces
  server.tool(
    "list_workspaces",
    "List all workspaces the user has access to",
    {},
    async () => {
      try {
        const result = await api.listWorkspaces();
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

  // Get workspace details
  server.tool(
    "get_workspace",
    "Get details of a specific workspace including project list",
    {
      workspace_id: z.number().describe("The workspace ID"),
    },
    async ({ workspace_id }) => {
      try {
        const result = await api.getWorkspace(workspace_id);
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

  // Get workspace members
  server.tool(
    "get_workspace_members",
    "Get list of members in a workspace",
    {
      workspace_id: z.number().describe("The workspace ID"),
    },
    async ({ workspace_id }) => {
      try {
        const result = await api.getWorkspaceMembers(workspace_id);
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
}
