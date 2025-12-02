import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  CloudArrowUpIcon,
  TrashIcon,
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';
import { mediaApi } from '../lib/api';

export default function Media() {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => mediaApi.getAll({ limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الملف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await mediaApi.upload(file);
      }
      toast.success('تم رفع الملفات بنجاح');
      queryClient.invalidateQueries({ queryKey: ['media'] });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      deleteMutation.mutate(id);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success('تم نسخ الرابط');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return PhotoIcon;
      case 'VIDEO':
        return VideoCameraIcon;
      case 'AUDIO':
        return MusicalNoteIcon;
      default:
        return DocumentIcon;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const media = (data as any)?.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الوسائط</h1>
          <p className="text-gray-500 mt-1">إدارة الصور والملفات</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          {uploading ? 'جاري الرفع...' : 'رفع ملفات'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 spinner mx-auto" />
          </div>
        ) : media.length === 0 ? (
          <div className="p-16 text-center">
            <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-500">لا توجد ملفات</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 text-primary-600 hover:underline"
            >
              رفع ملفات جديدة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
            {media.map((item: any) => {
              const Icon = getIcon(item.type);
              return (
                <div
                  key={item.id}
                  className="group relative border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {item.type === 'IMAGE' ? (
                    <img
                      src={item.url}
                      alt={item.alt || item.originalName}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs text-gray-900 truncate" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <p className="text-xs text-gray-500">{formatSize(item.size)}</p>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(item.url)}
                      className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-medium hover:bg-gray-100"
                    >
                      نسخ الرابط
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

