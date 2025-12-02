import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { tagsApi } from '../lib/api';

interface TagForm {
  name: string;
  nameAr: string;
  nameEn: string;
  type: string;
}

export default function Tags() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TagForm>({
    defaultValues: { name: '', nameAr: '', nameEn: '', type: 'GENERAL' },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['tags', search],
    queryFn: () => tagsApi.getAll(search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => tagsApi.create(data),
    onSuccess: () => {
      toast.success('تم إنشاء الوسم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      closeModal();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tagsApi.update(id, data),
    onSuccess: () => {
      toast.success('تم تحديث الوسم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      closeModal();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الوسم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const openModal = (tag?: any) => {
    if (tag) {
      setEditingId(tag.id);
      reset({ name: tag.name, nameAr: tag.nameAr || '', nameEn: tag.nameEn || '', type: tag.type });
    } else {
      setEditingId(null);
      reset({ name: '', nameAr: '', nameEn: '', type: 'GENERAL' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (data: TagForm) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف "${name}"؟`)) {
      deleteMutation.mutate(id);
    }
  };

  const tags = (data as any)?.data || [];
  const saving = createMutation.isPending || updateMutation.isPending;

  const typeLabels: Record<string, string> = {
    GENERAL: 'عام',
    PERSON: 'شخص',
    ORGANIZATION: 'منظمة',
    LOCATION: 'موقع',
    EVENT: 'حدث',
    TOPIC: 'موضوع',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الوسوم</h1>
          <p className="text-gray-500 mt-1">إدارة وسوم المقالات</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          وسم جديد
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <input
          type="text"
          placeholder="البحث في الوسوم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 spinner mx-auto" />
          </div>
        ) : tags.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد وسوم</div>
        ) : (
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag: any) => (
                <div
                  key={tag.id}
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <span className="font-medium">{tag.name}</span>
                  <span className="text-xs text-gray-500">({tag.usageCount})</span>
                  <span className="text-xs text-gray-400">{typeLabels[tag.type]}</span>
                  <div className="hidden group-hover:flex items-center gap-1 mr-1">
                    <button
                      onClick={() => openModal(tag)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id, tag.name)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingId ? 'تعديل الوسم' : 'وسم جديد'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم *</label>
                <input
                  {...register('name', { required: 'الاسم مطلوب' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بالعربية</label>
                  <input
                    {...register('nameAr')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">بالإنجليزية</label>
                  <input
                    {...register('nameEn')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="GENERAL">عام</option>
                  <option value="PERSON">شخص</option>
                  <option value="ORGANIZATION">منظمة</option>
                  <option value="LOCATION">موقع</option>
                  <option value="EVENT">حدث</option>
                  <option value="TOPIC">موضوع</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

