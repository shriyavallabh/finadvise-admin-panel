
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Agent, Campaign, Advisor, OverviewMetrics, SystemLog } from '@/types';

/**
 * FinAdvise API Client
 * Integrates with your existing FinAdvise backend system
 */
class FinAdviseAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle auth failure
          window.location.href = '/login';
        }
        throw error;
      }
    );
  }

  // Agent Management
  async getAgents(): Promise<Agent[]> {
    const response = await this.client.get('/agents');
    return response.data;
  }

  async getAgentStatus(agentId: string) {
    const response = await this.client.get(`/agents/${agentId}/status`);
    return response.data;
  }

  async startAgent(agentId: string) {
    const response = await this.client.post(`/agents/${agentId}/start`);
    return response.data;
  }

  async stopAgent(agentId: string) {
    const response = await this.client.post(`/agents/${agentId}/stop`);
    return response.data;
  }

  async restartAgent(agentId: string) {
    const response = await this.client.post(`/agents/${agentId}/restart`);
    return response.data;
  }

  async getAgentLogs(agentId: string, limit = 100) {
    const response = await this.client.get(`/agents/${agentId}/logs?limit=${limit}`);
    return response.data;
  }

  // Campaign Management
  async getCampaigns(): Promise<Campaign[]> {
    const response = await this.client.get('/campaigns');
    return response.data;
  }

  async createCampaign(campaign: Partial<Campaign>) {
    const response = await this.client.post('/campaigns', campaign);
    return response.data;
  }

  async updateCampaign(campaignId: string, updates: Partial<Campaign>) {
    const response = await this.client.put(`/campaigns/${campaignId}`, updates);
    return response.data;
  }

  // Advisor Management
  async getAdvisors(): Promise<Advisor[]> {
    const response = await this.client.get('/advisors');
    return response.data;
  }

  async addAdvisor(advisor: Partial<Advisor>) {
    const response = await this.client.post('/advisors', advisor);
    return response.data;
  }

  async updateAdvisor(advisorId: string, updates: Partial<Advisor>) {
    const response = await this.client.put(`/advisors/${advisorId}`, updates);
    return response.data;
  }

  // WhatsApp Integration
  async getWhatsAppTemplates() {
    const response = await this.client.get('/whatsapp/templates');
    return response.data;
  }

  async sendWhatsAppMessage(templateId: string, recipients: string[], variables?: Record<string, any>) {
    const response = await this.client.post('/whatsapp/send', {
      templateId,
      recipients,
      variables
    });
    return response.data;
  }

  // Analytics
  async getOverviewMetrics(): Promise<OverviewMetrics> {
    const response = await this.client.get('/analytics/overview');
    return response.data;
  }

  async getRealTimeMetrics(metric: string) {
    const response = await this.client.get(`/analytics/realtime/${metric}`);
    return response.data;
  }

  // System Logs
  async getSystemLogs(limit = 1000): Promise<SystemLog[]> {
    const response = await this.client.get(`/logs?limit=${limit}`);
    return response.data;
  }
}

// Export singleton instance
export const finadviseAPI = new FinAdviseAPI();
export default finadviseAPI;
