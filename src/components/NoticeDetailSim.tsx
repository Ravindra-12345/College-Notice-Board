import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Copy,
  Trash2,
  Check,
  CheckCircle2,
  Share2,
  BookmarkCheck,
  School,
  Code2,
  Cpu,
  Zap,
  Cog,
  Building,
  Globe,
} from 'lucide-react';
import { Notice, DEPARTMENTS } from '../types/notice';

interface NoticeDetailSimProps {
  notice: Notice;
  onBack: () => void;
  onDeleteNotice: (id: string) => void;
}

export const NoticeDetailSim: React.FC<NoticeDetailSimProps> = ({
  notice,
  onBack,
  onDeleteNotice,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getDeptColor = (deptName: string) => {
    const dept = DEPARTMENTS.find((d) => d.name.toLowerCase() === deptName.toLowerCase());
    return dept ? dept.color : '#1e40af';
  };

  const getDeptIcon = (deptName: string) => {
    if (deptName.includes('CSE') || deptName.includes('Computer')) return <Code2 className="w-4 h-4" />;
    if (deptName.includes('ECE') || deptName.includes('Electronics')) return <Cpu className="w-4 h-4" />;
    if (deptName.includes('EEE') || deptName.includes('Electrical')) return <Zap className="w-4 h-4" />;
    if (deptName.includes('Mechanical')) return <Cog className="w-4 h-4" />;
    if (deptName.includes('Civil')) return <Building className="w-4 h-4" />;
    if (deptName.includes('IT') || deptName.includes('Information')) return <Globe className="w-4 h-4" />;
    return <School className="w-4 h-4" />;
  };

  const formatDetailedDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const copyToClipboard = () => {
    const fullText = `*${notice.title}*\nDepartment: ${notice.department}\nDate: ${formatDetailedDate(
      notice.publishedDate
    )}\n\n${notice.description}\n\n(Campus Notice Board)`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const color = getDeptColor(notice.department);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative overflow-hidden">
      {/* Copied Toast Banner */}
      {copied && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span>Notice copied to clipboard successfully!</span>
        </div>
      )}

      {/* Top App Bar */}
      <div className="bg-[#1e40af] text-white px-3 py-3 flex items-center justify-between shadow-md z-20 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            title="Back to Notice List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-tight">Notice Details</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            title="Copy Notice Content"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-red-200 hover:text-red-100"
            title="Delete Notice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-4">
        {/* Department Badge */}
        <div>
          <span
            style={{
              backgroundColor: `${color}16`,
              color: color,
              borderColor: `${color}35`,
            }}
            className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs"
          >
            {getDeptIcon(notice.department)}
            <span>{notice.department}</span>
          </span>
        </div>

        {/* Notice Title */}
        <h1 className="text-lg font-extrabold text-slate-900 leading-snug tracking-tight">
          {notice.title}
        </h1>

        {/* Date & Metadata Bar */}
        <div className="bg-slate-100/90 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="font-medium text-slate-700">
            Published on: {formatDetailedDate(notice.publishedDate)}
          </span>
        </div>

        <div className="border-t border-slate-200" />

        {/* Notice Description Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#1e40af] rounded-full" />
            <h2 className="text-xs font-bold text-[#1e40af] uppercase tracking-wider">
              Announcement Description
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal selection:bg-blue-100 selection:text-blue-900">
              {notice.description}
            </p>
          </div>
        </div>

        {/* Official College Watermark Card */}
        <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 flex items-start gap-2.5 text-slate-600 text-[11px]">
          <BookmarkCheck className="w-4 h-4 text-[#1e40af] shrink-0 mt-0.5" />
          <p className="leading-snug">
            This notice is officially recorded in the campus offline storage. All students and
            faculty affiliated with this department are requested to take note.
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={copyToClipboard}
            className="flex-1 py-2.5 bg-white border border-slate-300 hover:border-slate-400 active:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Notice'}</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: notice.title,
                  text: notice.description,
                }).catch(() => {});
              } else {
                copyToClipboard();
              }
            }}
            className="flex-1 py-2.5 bg-[#1e40af] hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Delete Notice?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove &quot;{notice.title}&quot;? This notice will be deleted
              from local storage.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteNotice(notice.id);
                  onBack();
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
