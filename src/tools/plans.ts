import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getApiClient, RytnowApiClient } from "../api-client.js";

export function registerPlanTools(server: McpServer) {
  const api = getApiClient();

  // List plans
  server.tool(
    "list_plans",
    "List all plans in a project",
    {
      project_id: z.number().describe("The project ID"),
      status: z.enum(["draft", "active", "on_hold", "completed", "cancelled"]).optional().describe("Filter by plan status"),
    },
    async ({ project_id, status }) => {
      try {
        const result = await api.listPlans(project_id, { status });
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

  // Get plan details
  server.tool(
    "get_plan",
    "Get details of a plan including linked tasks",
    {
      project_id: z.number().describe("The project ID"),
      plan_id: z.number().describe("The plan ID"),
    },
    async ({ project_id, plan_id }) => {
      try {
        const result = await api.getPlan(project_id, plan_id);
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

  // Create plan
  server.tool(
    "create_plan",
    "Create a new plan in a project",
    {
      project_id: z.number().describe("The project ID"),
      title: z.string().min(1).describe("Plan title"),
      content: z.string().optional().describe("Plan content/description (supports HTML)"),
      target_date: z.string().optional().describe("Target completion date in YYYY-MM-DD format"),
      status: z.enum(["draft", "active"]).optional().default("draft").describe("Initial status"),
    },
    async ({ project_id, title, content, target_date, status }) => {
      try {
        const result = await api.createPlan(project_id, { title, content, target_date, status });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Plan "${title}" created`,
                plan: result.data,
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

  // Update plan status
  server.tool(
    "update_plan_status",
    "Change the status of a plan",
    {
      project_id: z.number().describe("The project ID"),
      plan_id: z.number().describe("The plan ID"),
      status: z.enum(["draft", "active", "on_hold", "completed", "cancelled"]).describe("New status"),
    },
    async ({ project_id, plan_id, status }) => {
      try {
        const result = await api.updatePlanStatus(project_id, plan_id, status);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Plan status changed to ${status}`,
                plan: result.data,
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

  // Link task to plan
  server.tool(
    "link_task_to_plan",
    "Link an existing task to a plan",
    {
      project_id: z.number().describe("The project ID"),
      plan_id: z.number().describe("The plan ID"),
      task_id: z.number().describe("The task ID to link"),
    },
    async ({ project_id, plan_id, task_id }) => {
      try {
        const result = await api.linkTaskToPlan(project_id, plan_id, task_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Task linked to plan",
                ...result,
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

  // Unlink task from plan
  server.tool(
    "unlink_task_from_plan",
    "Unlink a task from a plan",
    {
      project_id: z.number().describe("The project ID"),
      plan_id: z.number().describe("The plan ID"),
      task_id: z.number().describe("The task ID to unlink"),
    },
    async ({ project_id, plan_id, task_id }) => {
      try {
        await api.unlinkTaskFromPlan(project_id, plan_id, task_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Task unlinked from plan",
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
