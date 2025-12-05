#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerWorkspaceTools } from "./tools/workspaces.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerPlanTools } from "./tools/plans.js";
import { registerTimeEntryTools } from "./tools/time-entries.js";
import { registerCommentTools } from "./tools/comments.js";
import { registerResources } from "./resources/index.js";

async function main() {
  // Create MCP server
  const server = new McpServer({
    name: "rytnow",
    version: "1.0.0",
  });

  // Register all tools
  registerWorkspaceTools(server);
  registerProjectTools(server);
  registerTaskTools(server);
  registerPlanTools(server);
  registerTimeEntryTools(server);
  registerCommentTools(server);

  // Register resources
  registerResources(server);

  // Create STDIO transport
  const transport = new StdioServerTransport();

  // Connect server to transport
  await server.connect(transport);

  // Log to stderr (stdout is reserved for MCP protocol)
  console.error("Rytnow MCP Server started");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
