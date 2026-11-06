// Kiểu dữ liệu trả về từ ai-service (trợ lý AI, hộp thư nhân viên, kho tài liệu)

export type AiSenderType = 'user' | 'ai' | 'admin' | 'system';

export type AiConversationStatus = 'ai_handling' | 'escalated' | 'admin_handling' | 'closed';

export type AiReplyMode = 'full' | 'sources_only' | 'handoff' | 'blocked' | 'refused' | 'human' | 'duplicate';

// Thẻ xe bot gợi ý
export interface AiProductCard {
  vehicle_id: number;
  name: string;
  year: number | null;
  exterior_color: string | null;
  price: number | null;
  image_url: string | null;
  status: string | null;
  status_label: string;
  url: string;
}

// Nguồn trích dẫn của câu trả lời
export interface AiSource {
  type: 'vehicle' | 'document' | 'database';
  title: string | null;
  vehicle_id?: number;
  page?: string | null;
  knowledge_id?: number | null;
  sql?: string;
  score?: number | null;
}

// Phần thêm của tin bot: thẻ xe, nguồn, kiểu trả lời
export interface AiMessageExtra {
  mode?: AiReplyMode;
  route?: string;
  products?: AiProductCard[];
  sources?: AiSource[];
}

export interface AiMessage {
  id: number;
  conversation_id: number;
  channel: string;
  sender_type: AiSenderType;
  sender_id: number | null;
  content: string;
  extra: AiMessageExtra | null;
  created_at: string;
}

export interface AiReply {
  id: number;
  sender_type: AiSenderType;
  content: string;
  mode: AiReplyMode;
  products: AiProductCard[];
  sources: AiSource[];
  created_at: string;
}

export interface AiChatResponse {
  conversation_id: number;
  status: AiConversationStatus;
  guest_token: string | null;
  clear_guest_token: boolean;
  user_message: AiMessage;
  reply: AiReply | null;
}

export interface AiHistoryResponse {
  conversation_id: number | null;
  status: AiConversationStatus | null;
  messages: AiMessage[];
}

export interface AiCustomerInfo {
  name: string;
  phone: string | null;
  telegram_username: string | null;
}

export interface AiConversation {
  id: number;
  channel_type: 'web' | 'telegram';
  user_id: number | null;
  guest_id: string | null;
  telegram_account_id: number | null;
  status: AiConversationStatus;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  sentiment: string | null;
  assigned_to: number | null;
  escalation_reason: string | null;
  summary: string | null;
  sla_due_at: string | null;
  first_response_at: string | null;
  last_message_at: string | null;
  created_at: string;
  closed_at: string | null;
  customer: AiCustomerInfo;
  sla_overdue: boolean;
}

export interface AiConversationEvent {
  event_type: string;
  actor_type: string | null;
  actor_id: number | null;
  old_value: string | null;
  new_value: string | null;
  data: Record<string, unknown> | null;
  created_at: string;
}

export interface AiConversationDetail {
  conversation: AiConversation;
  messages: AiMessage[];
  events: AiConversationEvent[];
}

export interface AiKnowledgeDocument {
  id: number;
  file_name: string;
  doc_type: 'chinh_sach' | 'kien_thuc' | 'huong_dan';
  status: 'processing' | 'ready' | 'failed';
  chunk_count: number | null;
  error_message: string | null;
  uploaded_by: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface AiSystemStatus {
  vehicles_snapshot: number;
  [key: string]: unknown;
}
