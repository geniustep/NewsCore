import { useState } from 'react';
import toast from 'react-hot-toast';
import { Cog6ToothIcon, GlobeAltIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'عام', icon: Cog6ToothIcon },
    { id: 'site', name: 'الموقع', icon: GlobeAltIcon },
    { id: 'notifications', name: 'الإشعارات', icon: BellIcon },
    { id: 'security', name: 'الأمان', icon: ShieldCheckIcon },
  ];

  const handleSave = () => {
    toast.success('تم حفظ الإعدادات');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 mt-1">إعدادات النظام والموقع</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b">
          <nav className="flex gap-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الموقع
                </label>
                <input
                  type="text"
                  defaultValue="صحراء 2797"
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الموقع
                </label>
                <textarea
                  rows={3}
                  defaultValue="موقع إخباري شامل"
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللغة الافتراضية
                </label>
                <select className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنطقة الزمنية
                </label>
                <select className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="Africa/Casablanca">توقيت المغرب</option>
                  <option value="Asia/Riyadh">توقيت الرياض</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'site' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الموقع
                </label>
                <input
                  type="url"
                  defaultValue="https://sahara2797.com"
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شعار الموقع
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <GlobeAltIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    تغيير الشعار
                  </button>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">تفعيل وضع الصيانة</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">إرسال إشعارات البريد الإلكتروني</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">إشعار عند نشر مقال جديد</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">إشعار عند تسجيل مستخدم جديد</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">تفعيل التحقق بخطوتين</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدة صلاحية الجلسة (بالدقائق)
                </label>
                <input
                  type="number"
                  defaultValue={60}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأقصى لمحاولات تسجيل الدخول
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}

