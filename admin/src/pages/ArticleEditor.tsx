import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { articlesApi, categoriesApi, tagsApi } from '../lib/api';
import {
  ArrowRightIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

interface ArticleForm {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  status: string;
  type: string;
  coverImageUrl: string;
  categoryIds: string[];
  tagIds: string[];
  isPinned: boolean;
  isFeatured: boolean;
  isBreaking: boolean;
  seoTitle: string;
  seoDescription: string;
}

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ArticleForm>({
    defaultValues: {
      title: '',
      subtitle: '',
      excerpt: '',
      content: '',
      status: 'DRAFT',
      type: 'STANDARD',
      coverImageUrl: '',
      categoryIds: [],
      tagIds: [],
      isPinned: false,
      isFeatured: false,
      isBreaking: false,
      seoTitle: '',
      seoDescription: '',
    },
  });

  const { data: article, isLoading: articleLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesApi.getOne(id!),
    enabled: isEditing,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getAll(),
  });

  useEffect(() => {
    if (article) {
      const data = (article as any).data;
      reset({
        title: data.title,
        subtitle: data.subtitle || '',
        excerpt: data.excerpt || '',
        content: data.content,
        status: data.status,
        type: data.type,
        coverImageUrl: data.coverImageUrl || '',
        categoryIds: data.categories?.map((c: any) => c.id) || [],
        tagIds: data.tags?.map((t: any) => t.id) || [],
        isPinned: data.isPinned,
        isFeatured: data.isFeatured,
        isBreaking: data.isBreaking,
        seoTitle: data.seo?.title || '',
        seoDescription: data.seo?.description || '',
      });
    }
  }, [article, reset]);

  const createMutation = useMutation({
    mutationFn: (data: any) => articlesApi.create(data),
    onSuccess: () => {
      toast.success('تم إنشاء المقال بنجاح');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate('/articles');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => articlesApi.update(id!, data),
    onSuccess: () => {
      toast.success('تم تحديث المقال بنجاح');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ArticleForm) => {
    const payload = {
      ...data,
      contentHtml: data.content,
    };

    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEditing && articleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/articles')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'تعديل المقال' : 'مقال جديد'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان *
                </label>
                <input
                  {...register('title', { required: 'العنوان مطلوب' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  placeholder="أدخل عنوان المقال"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان الفرعي
                </label>
                <input
                  {...register('subtitle')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="عنوان فرعي اختياري"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المحتوى *
                </label>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: 'المحتوى مطلوب' }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          [{ align: [] }],
                          ['blockquote', 'code-block'],
                          ['link', 'image', 'video'],
                          ['clean'],
                        ],
                      }}
                      placeholder="اكتب محتوى المقال هنا..."
                    />
                  )}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الملخص
                </label>
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ملخص قصير للمقال (يظهر في القوائم)"
                />
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">تحسين محركات البحث (SEO)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان SEO
                </label>
                <input
                  {...register('seoTitle')}
                  maxLength={70}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="عنوان مخصص لمحركات البحث"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {watch('seoTitle')?.length || 0}/70
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف SEO
                </label>
                <textarea
                  {...register('seoDescription')}
                  maxLength={160}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="وصف مخصص لمحركات البحث"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {watch('seoDescription')?.length || 0}/160
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">النشر</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="DRAFT">مسودة</option>
                  <option value="PENDING_REVIEW">قيد المراجعة</option>
                  <option value="PUBLISHED">منشور</option>
                  <option value="ARCHIVED">مؤرشف</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النوع
                </label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="STANDARD">عادي</option>
                  <option value="BREAKING">عاجل</option>
                  <option value="ANALYSIS">تحليل</option>
                  <option value="OPINION">رأي</option>
                  <option value="INTERVIEW">مقابلة</option>
                  <option value="VIDEO">فيديو</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isPinned')} className="rounded" />
                  <span className="text-sm">مثبت</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isFeatured')} className="rounded" />
                  <span className="text-sm">مميز</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isBreaking')} className="rounded" />
                  <span className="text-sm">خبر عاجل</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 spinner" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-5 h-5" />
                    {isEditing ? 'حفظ التغييرات' : 'نشر المقال'}
                  </>
                )}
              </button>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">صورة الغلاف</h3>
              <div>
                <input
                  {...register('coverImageUrl')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="رابط الصورة"
                />
              </div>
              {watch('coverImageUrl') && (
                <img
                  src={watch('coverImageUrl')}
                  alt="Cover"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">التصنيفات</h3>
              <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(categories as any)?.data?.map((cat: any) => (
                      <label key={cat.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(field.value || []).includes(cat.id)}
                          onChange={(e) => {
                            const currentValue = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentValue, cat.id]);
                            } else {
                              field.onChange(currentValue.filter((id: string) => id !== cat.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">الوسوم</h3>
              <Controller
                name="tagIds"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {(tags as any)?.data?.map((tag: any) => {
                      const currentValue = field.value || [];
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            if (currentValue.includes(tag.id)) {
                              field.onChange(currentValue.filter((id: string) => id !== tag.id));
                            } else {
                              field.onChange([...currentValue, tag.id]);
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            currentValue.includes(tag.id)
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

