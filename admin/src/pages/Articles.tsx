import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { articlesApi } from '../lib/api';

const statusLabels: Record<string, { label: string; class: string }> = {
  DRAFT: { label: 'مسودة', class: 'badge-gray' },
  PENDING_REVIEW: { label: 'قيد المراجعة', class: 'badge-warning' },
  APPROVED: { label: 'موافق عليه', class: 'badge-info' },
  SCHEDULED: { label: 'مجدول', class: 'badge-info' },
  PUBLISHED: { label: 'منشور', class: 'badge-success' },
  ARCHIVED: { label: 'مؤرشف', class: 'badge-gray' },
  REJECTED: { label: 'مرفوض', class: 'badge-danger' },
};

export default function Articles() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['articles', { search, status, page }],
    queryFn: () =>
      articlesApi.getAll({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: 10,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => articlesApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف المقال بنجاح');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف "${title}"؟`)) {
      deleteMutation.mutate(id);
    }
  };

  const articles = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta || { total: 0, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المقالات</h1>
          <p className="text-gray-500 mt-1">إدارة المقالات الإخبارية</p>
        </div>
        <Link
          to="/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          مقال جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المقالات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">جميع الحالات</option>
              <option value="DRAFT">مسودة</option>
              <option value="PENDING_REVIEW">قيد المراجعة</option>
              <option value="PUBLISHED">منشور</option>
              <option value="ARCHIVED">مؤرشف</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 spinner mx-auto" />
            <p className="mt-2 text-gray-500">جاري التحميل...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد مقالات
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المقال
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكاتب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المشاهدات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {articles.map((article: any) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {article.coverImageUrl ? (
                            <img
                              src={article.coverImageUrl}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <EyeIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-xs">
                              {article.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {article.author?.displayName || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${
                            statusLabels[article.status]?.class || 'badge-gray'
                          }`}
                        >
                          {statusLabels[article.status]?.label || article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {article.views || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/articles/${article.id}/edit`}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id, article.title)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  عرض {articles.length} من {meta.total} مقال
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                  >
                    السابق
                  </button>
                  <span className="px-3 py-1">
                    {page} / {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

