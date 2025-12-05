import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getApiClient, RytnowApiClient } from "../api-client.js";

export function registerProjectTools(server: McpServer) {
  const api = getApiClient();

  // List projects in workspace
  server.tool(
    "list_projects",
    "List all projects in a workspace",
    {
      workspace_id: z.number().describe("The workspace ID"),
      status: z.enum(["active", "on_hold", "completed", "archived"]).optional().describe("Filter by project status"),
      search: z.string().optional().describe("Search projects by name"),
    },
    async ({ workspace_id, status, search }) => {
      try {
        const result = await api.listProjects(workspace_id, { status, search });
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

  // Get project details
  server.tool(
    "get_project",
    "Get details of a specific project including task summary",
    {
      workspace_id: z.number().describe("The workspace ID"),
      project_id: z.number().describe("The project ID"),
    },
    async ({ workspace_id, project_id }) => {
      try {
        const result = await api.getProject(workspace_id, project_id);
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

  // Get project labels
  server.tool(
    "list_labels",
    "List all labels in a project",
    {
      project_id: z.number().describe("The project ID"),
    },
    async ({ project_id }) => {
      try {
        const result = await api.listLabels(project_id);
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
