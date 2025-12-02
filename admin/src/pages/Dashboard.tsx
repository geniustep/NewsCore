import { useQuery } from '@tanstack/react-query';
import {
  DocumentTextIcon,
  FolderIcon,
  TagIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { articlesApi, categoriesApi, tagsApi } from '../lib/api';

export default function Dashboard() {
  const { data: articlesData } = useQuery({
    queryKey: ['articles-stats'],
    queryFn: () => articlesApi.getAll({ limit: 1 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags-popular'],
    queryFn: () => tagsApi.getPopular(10),
  });

  const { data: recentArticles } = useQuery({
    queryKey: ['recent-articles'],
    queryFn: () => articlesApi.getAll({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
  });

  const stats = [
    {
      name: 'المقالات',
      value: (articlesData as any)?.data?.meta?.total || 0,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'التصنيفات',
      value: (categoriesData as any)?.data?.length || 0,
      icon: FolderIcon,
      color: 'bg-green-500',
    },
    {
      name: 'الوسوم',
      value: (tagsData as any)?.data?.length || 0,
      icon: TagIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'المشاهدات',
      value: '—',
      icon: EyeIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">مرحباً بك في لوحة إدارة NewsCore</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border p-6 card-hover"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              آخر المقالات
            </h2>
          </div>
          <div className="divide-y">
            {(recentArticles as any)?.data?.data?.length > 0 ? (
              (recentArticles as any).data.data.map((article: any) => (
                <div key={article.id} className="p-4 hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900 truncate">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span
                      className={`badge ${
                        article.status === 'PUBLISHED'
                          ? 'badge-success'
                          : article.status === 'DRAFT'
                          ? 'badge-gray'
                          : 'badge-warning'
                      }`}
                    >
                      {article.status === 'PUBLISHED'
                        ? 'منشور'
                        : article.status === 'DRAFT'
                        ? 'مسودة'
                        : article.status}
                    </span>
                    <span>{article.author?.displayName}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                لا توجد مقالات بعد
              </div>
            )}
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />
              الوسوم الشائعة
            </h2>
          </div>
          <div className="p-6">
            {(tagsData as any)?.data?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(tagsData as any).data.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag.name}
                    <span className="text-xs text-gray-400">
                      ({tag.usageCount})
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                لا توجد وسوم بعد
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

