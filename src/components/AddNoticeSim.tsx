import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Send,
  AlertCircle,
  School,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';
import { Notice, DEPARTMENTS } from '../types/notice';

interface AddNoticeSimProps {
  initialDepartment?: string;
  onBack: () => void;
  onSaveNotice: (notice: Notice) => void;
}

export const AddNoticeSim: React.FC<AddNoticeSimProps> = ({
  initialDepartment,
  onBack,
  onSaveNotice,
}) => {
  const [department, setDepartment] = useState<string>(
    initialDepartment || ''
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publishedDate, setPublishedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const MAX_TITLE = 120;
  const MIN_TITLE = 5;
  const MAX_DESC = 2000;
  const MIN_DESC = 15;

  // Validation rules
  const errors = {
    department: !department ? 'Please select an academic department.' : null,
    title: !title.trim()
      ? 'Notice title cannot be empty.'
      : title.trim().length < MIN_TITLE
      ? `Title must be at least ${MIN_TITLE} characters long.`
      : title.trim().length > MAX_TITLE
      ? `Title cannot exceed ${MAX_TITLE} characters.`
      : null,
    description: !description.trim()
      ? 'Notice description cannot be empty.'
      : description.trim().length < MIN_DESC
      ? `Description must be at least ${MIN_DESC} characters long.`
      : description.trim().length > MAX_DESC
      ? `Description cannot exceed ${MAX_DESC} characters.`
      : null,
  };

  const isValid = !errors.department && !errors.title && !errors.description;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      department: true,
      title: true,
      description: true,
    });

    if (!isValid) return;

    setIsSubmitting(true);

    const now = new Date();
    const [year, month, day] = publishedDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day, now.getHours(), now.getMinutes());

    const newNotice: Notice = {
      id: Date.now().toString(),
      title: title.trim(),
      department: department.trim(),
      description: description.trim(),
      publishedDate: dateObj.toISOString(),
    };

    setTimeout(() => {
      onSaveNotice(newNotice);
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        onBack();
      }, 1200);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative overflow-hidden">
      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
          <div>
            <p className="font-bold">Notice Published Successfully!</p>
            <p className="text-[11px] text-emerald-100 font-normal">
              Stored offline and updated on Campus Notice Board.
            </p>
          </div>
        </div>
      )}

      {/* Top App Bar */}
      <div className="bg-[#1e40af] text-white px-3 py-3 flex items-center justify-between shadow-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            title="Cancel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-tight">Post New Notice</span>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-blue-900 text-xs">
          <School className="w-4 h-4 text-[#1e40af] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Announcements published here are saved in local storage (simulating Flutter
            SharedPreferences) and instantly updated across all screens.
          </p>
        </div>

        {/* 1. Department Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setTouched((prev) => ({ ...prev, department: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, department: true }))}
              className={`w-full bg-white text-xs text-slate-800 rounded-xl px-3.5 py-3 border appearance-none focus:outline-none transition-all pr-8 ${
                touched.department && errors.department
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
              }`}
            >
              <option value="" disabled>
                -- Select College Department --
              </option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {touched.department && errors.department && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.department}</span>
            </p>
          )}
        </div>

        {/* 2. Notice Title Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              Notice Title <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                title.length > MAX_TITLE ? 'text-red-600 font-bold' : 'text-slate-400'
              }`}
            >
              {title.length}/{MAX_TITLE}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={title}
              maxLength={MAX_TITLE + 10}
              placeholder="e.g. Schedule for Mid-Term Examination Nov 2026"
              onChange={(e) => {
                setTitle(e.target.value);
                setTouched((prev) => ({ ...prev, title: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
              className={`w-full bg-white text-xs text-slate-800 rounded-xl px-3.5 py-3 border focus:outline-none transition-all placeholder:text-slate-400 ${
                touched.title && errors.title
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
              }`}
            />
          </div>
          {touched.title && errors.title && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* 3. Published Date Picker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">
            Publish Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="w-full bg-white text-xs text-slate-800 rounded-xl px-3.5 py-2.5 border border-slate-300 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <p className="text-[10px] text-slate-400">
            Defaults to current date. You can select scheduled past or future dates.
          </p>
        </div>

        {/* 4. Notice Description Multiline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              Notice Description <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                description.length > MAX_DESC ? 'text-red-600 font-bold' : 'text-slate-400'
              }`}
            >
              {description.length}/{MAX_DESC}
            </span>
          </div>
          <div className="relative">
            <textarea
              rows={6}
              value={description}
              maxLength={MAX_DESC + 20}
              placeholder="Provide complete announcements, timing details, classroom/lab venues, eligibility rules, and faculty coordinator instructions..."
              onChange={(e) => {
                setDescription(e.target.value);
                setTouched((prev) => ({ ...prev, description: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
              className={`w-full bg-white text-xs text-slate-800 rounded-xl p-3.5 border focus:outline-none transition-all placeholder:text-slate-400 leading-relaxed ${
                touched.description && errors.description
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
              }`}
            />
          </div>
          {touched.description && errors.description && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#1e40af] hover:bg-blue-800 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Notice...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish Notice</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
