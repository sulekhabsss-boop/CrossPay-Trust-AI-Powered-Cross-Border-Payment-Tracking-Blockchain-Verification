import {
  User,
  Transaction,
  DashboardMetrics,
  CorridorRate,
  Notification,
  AuditLog,
  BlockchainRecord
} from '../types';

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('crosspay_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('crosspay_token', token);
    } else {
      localStorage.removeItem('crosspay_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`;
      try {
        const errJson = await response.json();
        if (errJson.error) errorMessage = errJson.error;
      } catch {
        // fallback
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(res.token);
    return res;
  }

  async getCurrentUser(): Promise<User> {
    const res = await this.request<{ user: User }>('/users/me');
    return res.user;
  }

  // Corridors
  async getCorridors(): Promise<CorridorRate[]> {
    const res = await this.request<{ corridors: CorridorRate[] }>('/corridors');
    return res.corridors;
  }

  // Transactions
  async getTransactions(params?: {
    search?: string;
    status?: string;
    corridor?: string;
    riskLevel?: string;
    role?: string;
  }): Promise<{ transactions: Transaction[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.corridor) query.set('corridor', params.corridor);
    if (params?.riskLevel) query.set('riskLevel', params.riskLevel);
    if (params?.role) query.set('role', params.role);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ transactions: Transaction[]; total: number }>(`/transactions${queryString}`);
  }

  async getTransaction(id: string): Promise<{ transaction: Transaction; isSimulating: boolean }> {
    return this.request<{ transaction: Transaction; isSimulating: boolean }>(`/transactions/${id}`);
  }

  async createTransaction(data: {
    sourceAmount: number;
    destinationCountryCode: string;
    recipientName: string;
    recipientEmail: string;
    recipientBank: string;
    recipientAccountLast4: string;
    purpose: string;
    autoSimulate?: boolean;
    forceScenario?: string;
  }): Promise<{ transaction: Transaction; message: string }> {
    return this.request<{ transaction: Transaction; message: string }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async advanceTransaction(id: string): Promise<{ transaction: Transaction }> {
    return this.request<{ transaction: Transaction }>(`/transactions/${id}/advance`, {
      method: 'POST'
    });
  }

  async approveTransaction(id: string, notes?: string): Promise<{ transaction: Transaction }> {
    return this.request<{ transaction: Transaction }>(`/transactions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  }

  async holdTransaction(id: string, notes?: string): Promise<{ transaction: Transaction }> {
    return this.request<{ transaction: Transaction }>(`/transactions/${id}/hold`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  }

  async requestVerification(id: string, notes?: string): Promise<{ transaction: Transaction }> {
    return this.request<{ transaction: Transaction }>(`/transactions/${id}/request-verification`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  }

  async rejectTransaction(id: string, notes?: string): Promise<{ transaction: Transaction }> {
    return this.request<{ transaction: Transaction }>(`/transactions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  }

  // Blockchain
  async verifyBlockchain(txId: string): Promise<{ verified: boolean; record?: BlockchainRecord; message: string }> {
    return this.request<{ verified: boolean; record?: BlockchainRecord; message: string }>(`/blockchain/${txId}`);
  }

  async getBlockchainStats(): Promise<{
    network: string;
    contractAddress: string;
    latestBlock: number;
    totalCommittedRecords: number;
    consensus: string;
    finalityTimeMs: number;
  }> {
    return this.request('/blockchain-stats');
  }

  // Audit Logs
  async getAuditLogs(txId?: string): Promise<{ auditLogs: AuditLog[]; total: number }> {
    const qs = txId ? `?transactionId=${txId}` : '';
    return this.request<{ auditLogs: AuditLog[]; total: number }>(`/audit${qs}`);
  }

  // Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const res = await this.request<{ metrics: DashboardMetrics }>('/dashboard/summary');
    return res.metrics;
  }

  // Notifications
  async getNotifications(userId?: string): Promise<Notification[]> {
    const qs = userId ? `?userId=${userId}` : '';
    const res = await this.request<{ notifications: Notification[] }>(`/notifications${qs}`);
    return res.notifications;
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.request(`/notifications/${id}/read`, { method: 'POST' });
  }

  // Demo Scenarios
  async triggerDemoScenario(scenarioId: 'scenario_1' | 'scenario_2' | 'scenario_3'): Promise<{ transaction: Transaction }> {
    return this.request<{ transaction: Transaction }>(`/demo/scenarios/${scenarioId}`, {
      method: 'POST'
    });
  }

  // System Settings
  async getSystemSettings(): Promise<any> {
    return this.request('/system/settings');
  }

  async updateSystemSettings(data: any): Promise<any> {
    return this.request('/system/settings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

export const api = new ApiClient();
