import axios, { type AxiosInstance, AxiosError } from "axios";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export class RytnowApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.RYTNOW_API_URL || "http://localhost:8000/api/v1";
    const token = process.env.RYTNOW_API_TOKEN;

    if (!token) {
      throw new Error("RYTNOW_API_TOKEN environment variable is required");
    }

    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  // Workspaces
  async listWorkspaces() {
    const response = await this.client.get("/workspaces");
    return response.data;
  }

  async getWorkspace(workspaceId: number) {
    const response = await this.client.get(`/workspaces/${workspaceId}`);
    return response.data;
  }

  async getWorkspaceMembers(workspaceId: number) {
    const response = await this.client.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  }

  // Projects
  async listProjects(workspaceId: number, params?: { status?: string; search?: string }) {
    const response = await this.client.get(`/workspaces/${workspaceId}/projects`, { params });
    return response.data;
  }

  async getProject(workspaceId: number, projectId: number) {
    const response = await this.client.get(`/workspaces/${workspaceId}/projects/${projectId}`);
    return response.data;
  }

  // Tasks
  async listTasks(projectId: number, params?: {
    status?: string;
    priority?: string;
    assigned_to?: number;
    per_page?: number;
  }) {
    const response = await this.client.get(`/projects/${projectId}/tasks`, { params });
    return response.data;
  }

  async getTask(projectId: number, taskId: number) {
    const response = await this.client.get(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  }

  async createTask(projectId: number, data: {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    assigned_to?: number;
    estimated_hours?: number;
    due_date?: string;
    story_points?: number;
  }) {
    const response = await this.client.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  }

  async updateTask(projectId: number, taskId: number, data: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    assigned_to?: number | null;
    estimated_hours?: number | null;
    due_date?: string | null;
    story_points?: number | null;
  }) {
    const response = await this.client.patch(`/projects/${projectId}/tasks/${taskId}`, data);
    return response.data;
  }

  async updateTaskStatus(projectId: number, taskId: number, status: "todo" | "in_progress" | "done") {
    const response = await this.client.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
    return response.data;
  }

  // Plans
  async listPlans(projectId: number, params?: { status?: string }) {
    const response = await this.client.get(`/projects/${projectId}/plans`, { params });
    return response.data;
  }

  async getPlan(projectId: number, planId: number) {
    const response = await this.client.get(`/projects/${projectId}/plans/${planId}`);
    return response.data;
  }

  async createPlan(projectId: number, data: {
    title: string;
    content?: string;
    target_date?: string;
    status?: "draft" | "active";
  }) {
    const response = await this.client.post(`/projects/${projectId}/plans`, data);
    return response.data;
  }

  async updatePlanStatus(projectId: number, planId: number, status: "draft" | "active" | "on_hold" | "completed" | "cancelled") {
    const response = await this.client.patch(`/projects/${projectId}/plans/${planId}/status`, { status });
    return response.data;
  }

  async linkTaskToPlan(projectId: number, planId: number, taskId: number) {
    const response = await this.client.post(`/projects/${projectId}/plans/${planId}/tasks/${taskId}/link`);
    return response.data;
  }

  async unlinkTaskFromPlan(projectId: number, planId: number, taskId: number) {
    const response = await this.client.delete(`/projects/${projectId}/plans/${planId}/tasks/${taskId}/unlink`);
    return response.data;
  }

  // Time Entries
  async listTimeEntries(taskId: number) {
    const response = await this.client.get(`/tasks/${taskId}/time-entries`);
    return response.data;
  }

  async startTimer(taskId: number, description?: string) {
    const response = await this.client.post(`/tasks/${taskId}/time-entries/start`, { description });
    return response.data;
  }

  async stopTimer(taskId: number) {
    const response = await this.client.post(`/tasks/${taskId}/time-entries/stop`);
    return response.data;
  }

  async logTime(taskId: number, data: {
    duration: number; // seconds
    description?: string;
    started_at?: string;
  }) {
    const response = await this.client.post(`/tasks/${taskId}/time-entries`, data);
    return response.data;
  }

  // Comments
  async listComments(taskId: number) {
    const response = await this.client.get(`/tasks/${taskId}/comments`);
    return response.data;
  }

  async addComment(taskId: number, content: string) {
    const response = await this.client.post(`/tasks/${taskId}/comments`, { content, type: "text" });
    return response.data;
  }

  // Subtasks
  async listSubtasks(taskId: number) {
    const response = await this.client.get(`/tasks/${taskId}/subtasks`);
    return response.data;
  }

  async createSubtask(taskId: number, data: { title: string; assigned_to?: number }) {
    const response = await this.client.post(`/tasks/${taskId}/subtasks`, data);
    return response.data;
  }

  async toggleSubtask(taskId: number, subtaskId: number) {
    const response = await this.client.patch(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
    return response.data;
  }

  // Labels
  async listLabels(projectId: number) {
    const response = await this.client.get(`/projects/${projectId}/labels`);
    return response.data;
  }

  // Error handling helper
  static formatError(error: unknown): string {
    if (error instanceof AxiosError) {
      const data = error.response?.data;
      if (data?.message) {
        return data.message;
      }
      if (data?.errors) {
        return Object.values(data.errors).flat().join(", ");
      }
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Unknown error occurred";
  }
}

// Singleton instance
let apiClient: RytnowApiClient | null = null;

export function getApiClient(): RytnowApiClient {
  if (!apiClient) {
    apiClient = new RytnowApiClient();
  }
  return apiClient;
}
