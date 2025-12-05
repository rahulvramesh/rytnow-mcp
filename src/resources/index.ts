import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getApiClient, RytnowApiClient } from "../api-client.js";

export function registerResources(server: McpServer) {
  const api = getApiClient();

  // Register a tool to read resources instead (more compatible)
  server.tool(
    "read_resource",
    "Read a Rytnow resource by URI",
    {
      uri: z.string().describe("Resource URI (e.g., rytnow://workspaces, rytnow://project/1/tasks)"),
    },
    async ({ uri }) => {
      try {
        const parsedUri = new URL(uri);
        const path = parsedUri.pathname.slice(2); // Remove leading //
        const segments = path.split("/").filter(Boolean);

        let result: any;

        if (segments[0] === "workspaces" && segments.length === 1) {
          result = await api.listWorkspaces();
        } else if (segments[0] === "workspace" && segments.length === 2) {
          const workspaceId = parseInt(segments[1], 10);
          result = await api.getWorkspace(workspaceId);
        } else if (segments[0] === "workspace" && segments[2] === "projects") {
          const workspaceId = parseInt(segments[1], 10);
          result = await api.listProjects(workspaceId);
        } else if (segments[0] === "project" && segments[2] === "tasks") {
          const projectId = parseInt(segments[1], 10);
          result = await api.listTasks(projectId, { per_page: 100 });
        } else if (segments[0] === "project" && segments[2] === "plans") {
          const projectId = parseInt(segments[1], 10);
          result = await api.listPlans(projectId);
        } else {
          return {
            content: [
              {
                type: "text",
                text: `Unknown resource URI: ${uri}. Valid URIs:
- rytnow://workspaces
- rytnow://workspace/{id}
- rytnow://workspace/{id}/projects
- rytnow://project/{id}/tasks
- rytnow://project/{id}/plans`,
              },
            ],
            isError: true,
          };
        }

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
