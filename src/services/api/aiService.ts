// Gọi API của ai-service: chat của khách, hộp thư nhân viên, kho tài liệu
import axios from 'axios';
import type {
  AiChatResponse,
  AiConversation,
  AiConversationDetail,
  AiHistoryResponse,
  AiKnowledgeDocument,
  AiMessage,
  AiSystemStatus,
} from '../../types/ai.types';

// VITE_AI_URL must point to the deployed AI service (or its reverse proxy).
// Never use localhost as the production fallback: it points to the visitor's
// own machine, not to the application server.
const AI_URL = import.meta.env.VITE_AI_URL || (
  import.meta.env.DEV ? 'http://localhost:8000' : ''
);

const GUEST_TOKEN_KEY = 'ai_guest_token';

// Không gửi cookie sang ai-service: cookie đăng nhập thuộc tên miền của gateway, ai-service không đọc được,
// và trình duyệt chặn request kèm cookie khi ai-service trả CORS "*". ai-service nhận token qua header.
const aiClient = axios.create({
  baseURL: AI_URL,
  withCredentials: false,
  // Bot cần vài giây để trả lời, để rộng hơn các API khác
  timeout: 60000,
});

function userHeaders() {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('access_token');
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  const guestToken = localStorage.getItem(GUEST_TOKEN_KEY);
  if (guestToken) {
    headers['X-Guest-Token'] = guestToken;
  }
  return headers;
}

function adminHeaders() {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('admin_access_token');
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  return headers;
}

// Lấy câu báo lỗi tiếng Việt của ai-service (nằm trong trường detail)
export function getAiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Không kết nối được trợ lý AI. Vui lòng thử lại sau.';
    }
    const detail = error.response.data?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    return 'Lỗi ' + error.response.status;
  }
  return 'Có lỗi xảy ra, vui lòng thử lại.';
}

export function getAiErrorStatus(error: unknown): number | null {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.status;
  }
  return null;
}

export function clearGuestToken() {
  localStorage.removeItem(GUEST_TOKEN_KEY);
}

// Lưu hoặc xóa guest_token theo kết quả của POST /ai/chat
function saveGuestToken(data: AiChatResponse) {
  if (data.guest_token) {
    localStorage.setItem(GUEST_TOKEN_KEY, data.guest_token);
  }
  if (data.clear_guest_token) {
    localStorage.removeItem(GUEST_TOKEN_KEY);
  }
}

export const aiChatService = {
  async sendMessage(message: string): Promise<AiChatResponse> {
    const body = { message: message, client_message_id: crypto.randomUUID() };
    const response = await aiClient.post<AiChatResponse>('/ai/chat', body, { headers: userHeaders() });
    saveGuestToken(response.data);
    return response.data;
  },

  async getHistory(afterId?: number): Promise<AiHistoryResponse> {
    const params: Record<string, number> = {};
    if (afterId) {
      params.after_id = afterId;
    }
    const response = await aiClient.get<AiHistoryResponse>('/ai/chat/history', {
      headers: userHeaders(),
      params: params,
    });
    return response.data;
  },

  // Liên kết Telegram: khách bấm link bot gửi, đăng nhập xong thì gửi mã
  async claimTelegramLink(code: string): Promise<void> {
    await aiClient.post('/ai/link/claim', { code: code }, { headers: userHeaders() });
  },
};

export const aiInboxService = {
  async getConversations(filters?: { status?: string; channel?: string; priority?: string }): Promise<AiConversation[]> {
    const params: Record<string, string> = {};
    if (filters?.status) {
      params.status = filters.status;
    }
    if (filters?.channel) {
      params.channel = filters.channel;
    }
    if (filters?.priority) {
      params.priority = filters.priority;
    }
    const response = await aiClient.get<{ conversations: AiConversation[] }>('/ai/inbox/conversations', {
      headers: adminHeaders(),
      params: params,
    });
    return response.data.conversations;
  },

  async getConversation(id: number): Promise<AiConversationDetail> {
    const response = await aiClient.get<AiConversationDetail>('/ai/inbox/conversations/' + id, {
      headers: adminHeaders(),
    });
    return response.data;
  },

  async assign(id: number): Promise<void> {
    await aiClient.post('/ai/inbox/conversations/' + id + '/assign', null, { headers: adminHeaders() });
  },

  async reply(id: number, content: string): Promise<AiMessage> {
    const response = await aiClient.post<AiMessage>(
      '/ai/inbox/conversations/' + id + '/reply',
      { content: content },
      { headers: adminHeaders() },
    );
    return response.data;
  },

  async returnToBot(id: number): Promise<void> {
    await aiClient.post('/ai/inbox/conversations/' + id + '/return-to-bot', null, { headers: adminHeaders() });
  },

  async close(id: number): Promise<void> {
    await aiClient.post('/ai/inbox/conversations/' + id + '/close', null, { headers: adminHeaders() });
  },
};

export const aiKnowledgeService = {
  async getDocuments(): Promise<AiKnowledgeDocument[]> {
    const response = await aiClient.get<{ documents: AiKnowledgeDocument[] }>('/ai/knowledge', {
      headers: adminHeaders(),
    });
    return response.data.documents;
  },

  async getDocument(id: number): Promise<AiKnowledgeDocument> {
    const response = await aiClient.get<AiKnowledgeDocument>('/ai/knowledge/' + id, { headers: adminHeaders() });
    return response.data;
  },

  // Tải file lên: để trình duyệt tự đặt Content-Type cho FormData
  async upload(file: File, docType: string): Promise<{ document: AiKnowledgeDocument; duplicate: boolean }> {
    const form = new FormData();
    form.append('file', file);
    form.append('doc_type', docType);
    const response = await aiClient.post<{ document: AiKnowledgeDocument; duplicate: boolean }>('/ai/knowledge', form, {
      headers: adminHeaders(),
    });
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await aiClient.delete('/ai/knowledge/' + id, { headers: adminHeaders() });
  },

  async reindexVehicles(): Promise<void> {
    await aiClient.post('/ai/admin/reindex-vehicles', null, { headers: adminHeaders() });
  },

  async getStatus(): Promise<AiSystemStatus> {
    const response = await aiClient.get<AiSystemStatus>('/ai/admin/status', { headers: adminHeaders() });
    return response.data;
  },
};
