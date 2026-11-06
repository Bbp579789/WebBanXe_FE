import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Upload, Trash2, RefreshCw, AlertTriangle, CheckCircle2, Loader2, Car } from 'lucide-react';
import { aiKnowledgeService, getAiErrorMessage } from '../../services/api/aiService';
import type { AiKnowledgeDocument, AiSystemStatus } from '../../types/ai.types';

// Kho tài liệu của trợ lý AI: admin tải tài liệu chính sách lên, bot trả lời theo tài liệu và trích nguồn
const docTypes = [
  { id: 'chinh_sach', name: 'Chính sách' },
  { id: 'kien_thuc', name: 'Kiến thức' },
  { id: 'huong_dan', name: 'Hướng dẫn' },
];

const statusLabels: Record<string, string> = {
  processing: 'Đang nạp',
  ready: 'Sẵn sàng',
  failed: 'Lỗi',
};

const statusColors: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-800',
  ready: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-rose-100 text-rose-800',
};

export const AdminKnowledgePage: React.FC = () => {
  const [documents, setDocuments] = useState<AiKnowledgeDocument[]>([]);
  const [systemStatus, setSystemStatus] = useState<AiSystemStatus | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('chinh_sach');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDocuments = useCallback(async () => {
    try {
      const rows = await aiKnowledgeService.getDocuments();
      setDocuments(rows);
      const status = await aiKnowledgeService.getStatus();
      setSystemStatus(status);
    } catch (err) {
      setError(getAiErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Còn tài liệu đang nạp thì 3 giây tải lại một lần để cập nhật trạng thái
  const hasProcessing = documents.some((item) => item.status === 'processing');
  useEffect(() => {
    if (!hasProcessing) return;
    const timer = setInterval(loadDocuments, 3000);
    return () => clearInterval(timer);
  }, [hasProcessing, loadDocuments]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    setError('');
    setMessage('');
    try {
      const result = await aiKnowledgeService.upload(file, docType);
      if (result.duplicate) {
        setMessage('Tài liệu này đã có trong kho, không cần nạp lại.');
      } else {
        setMessage('Đã tải lên "' + result.document.file_name + '". Hệ thống đang nạp tài liệu...');
      }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadDocuments();
    } catch (err) {
      setError(getAiErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (document: AiKnowledgeDocument) => {
    if (!window.confirm('Xóa tài liệu "' + document.file_name + '"? Bot sẽ không dùng tài liệu này nữa.')) return;
    setError('');
    setMessage('');
    try {
      await aiKnowledgeService.remove(document.id);
      setMessage('Đã xóa "' + document.file_name + '".');
      await loadDocuments();
    } catch (err) {
      setError(getAiErrorMessage(err));
    }
  };

  const handleReindex = async () => {
    setError('');
    setMessage('');
    try {
      await aiKnowledgeService.reindexVehicles();
      setMessage('Đang đồng bộ dữ liệu xe cho trợ lý AI, mất khoảng vài chục giây.');
      setTimeout(loadDocuments, 15000);
    } catch (err) {
      setError(getAiErrorMessage(err));
    }
  };

  return (
    <div className="p-8 text-zinc-900">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="size-6 text-[#b8955a]" /> Tài liệu trợ lý AI
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Tài liệu ở đây được trợ lý AI dùng để trả lời khách và ghi rõ nguồn trong câu trả lời.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {systemStatus && (
            <span className="text-xs text-zinc-600 bg-white border border-zinc-200 rounded-xl px-3 py-2 flex items-center gap-1.5">
              <Car className="size-4 text-[#b8955a]" /> {systemStatus.vehicles_snapshot} xe trong dữ liệu AI
            </span>
          )}
          <button
            onClick={handleReindex}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a0a0a] hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm"
          >
            <RefreshCw className="size-4" /> Đồng bộ dữ liệu xe
          </button>
        </div>
      </div>

      <form onSubmit={handleUpload} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-bold mb-3">Tải tài liệu mới</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.md,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold hover:file:bg-zinc-200"
          />
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {docTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!file || isUploading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#b8955a] hover:bg-[#a38048] text-white text-sm font-semibold disabled:opacity-40"
          >
            {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Tải lên
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">Nhận file PDF, DOCX, MD, TXT, tối đa 10 MB.</p>
      </form>

      {message && (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3 flex gap-2">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 flex gap-2">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-5 py-3">Tên tài liệu</th>
              <th className="px-5 py-3">Loại</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Số đoạn</th>
              <th className="px-5 py-3">Ngày tải</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-zinc-400">
                  Chưa có tài liệu nào
                </td>
              </tr>
            ) : (
              documents.map((item) => (
                <tr key={item.id} className="border-t border-zinc-100">
                  <td className="px-5 py-3 font-medium">{item.file_name}</td>
                  <td className="px-5 py-3">{docTypes.find((type) => type.id === item.doc_type)?.name || item.doc_type}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                    {item.status === 'failed' && item.error_message && (
                      <p className="text-xs text-rose-600 mt-1">{item.error_message}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">{item.chunk_count ?? '-'}</td>
                  <td className="px-5 py-3 text-zinc-500">{new Date(item.created_at).toLocaleString('vi-VN')}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={item.status === 'processing'}
                      title="Xóa tài liệu"
                      className="p-2 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminKnowledgePage;
