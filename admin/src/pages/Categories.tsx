import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { categoriesApi } from '../lib/api';

interface CategoryForm {
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  isFeatured: boolean;
}

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    defaultValues: {
      name: '',
      nameAr: '',
      nameEn: '',
      description: '',
      color: '#3B82F6',
      icon: '',
      isActive: true,
      isFeatured: false,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(true),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => categoriesApi.create(data),
    onSuccess: () => {
      toast.success('تم إنشاء التصنيف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      toast.success('تم تحديث التصنيف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف التصنيف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const openModal = (category?: any) => {
    if (category) {
      setEditingId(category.id);
      reset({
        name: category.name,
        nameAr: category.nameAr || '',
        nameEn: category.nameEn || '',
        description: category.description || '',
        color: category.color || '#3B82F6',
        icon: category.icon || '',
        isActive: category.isActive,
        isFeatured: category.isFeatured,
      });
    } else {
      setEditingId(null);
      reset({
        name: '',
        nameAr: '',
        nameEn: '',
        description: '',
        color: '#3B82F6',
        icon: '',
        isActive: true,
        isFeatured: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (data: CategoryForm) => {
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

  const categories = (data as any)?.data || [];
  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التصنيفات</h1>
          <p className="text-gray-500 mt-1">إدارة تصنيفات المقالات</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          تصنيف جديد
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 spinner mx-auto" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد تصنيفات
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {categories.map((category: any) => (
              <div
                key={category.id}
                className="border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color || '#3B82F6' }}
                    >
                      {category.icon || category.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {category.articlesCount} مقال
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal(category)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span
                    className={`badge ${
                      category.isActive ? 'badge-success' : 'badge-gray'
                    }`}
                  >
                    {category.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                  {category.isFeatured && (
                    <span className="badge badge-info">مميز</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingId ? 'تعديل التصنيف' : 'تصنيف جديد'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم *
                </label>
                <input
                  {...register('name', { required: 'الاسم مطلوب' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم بالعربية
                  </label>
                  <input
                    {...register('nameAr')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم بالإنجليزية
                  </label>
                  <input
                    {...register('nameEn')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اللون
                  </label>
                  <input
                    type="color"
                    {...register('color')}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الأيقونة
                  </label>
                  <input
                    {...register('icon')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="اسم الأيقونة"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isActive')} className="rounded" />
                  <span className="text-sm">نشط</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isFeatured')} className="rounded" />
                  <span className="text-sm">مميز</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
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

