import React, { useState } from 'react';
import {
  Megaphone,
  Search,
  X,
  RefreshCw,
  Plus,
  Calendar,
  ArrowRight,
  MoreVertical,
  AlertTriangle,
  RotateCw,
  Inbox,
  Code2,
  Cpu,
  Zap,
  Cog,
  Building,
  Globe,
  School,
  CheckCircle2,
} from 'lucide-react';
import { Notice, DEPARTMENTS } from '../types/notice';

interface HomeScreenSimProps {
  notices: Notice[];
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNoticeClick: (notice: Notice) => void;
  onOpenAddNotice: (initialDepartment?: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onLoadSampleData: () => void;
  onClearAllData: () => void;
}

export const HomeScreenSim: React.FC<HomeScreenSimProps> = ({
  notices,
  selectedDepartment,
  onSelectDepartment,
  searchQuery,
  onSearchChange,
  onNoticeClick,
  onOpenAddNotice,
  onRefresh,
  isLoading,
  errorMessage,
  onRetry,
  onLoadSampleData,
  onClearAllData,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getDeptColor = (deptName: string) => {
    const dept = DEPARTMENTS.find((d) => d.name.toLowerCase() === deptName.toLowerCase());
    return dept ? dept.color : '#1e40af';
  };

  const getDeptIcon = (deptName: string) => {
    if (deptName.includes('CSE') || deptName.includes('Computer')) return <Code2 className="w-3.5 h-3.5" />;
    if (deptName.includes('ECE') || deptName.includes('Electronics')) return <Cpu className="w-3.5 h-3.5" />;
    if (deptName.includes('EEE') || deptName.includes('Electrical')) return <Zap className="w-3.5 h-3.5" />;
    if (deptName.includes('Mechanical')) return <Cog className="w-3.5 h-3.5" />;
    if (deptName.includes('Civil')) return <Building className="w-3.5 h-3.5" />;
    if (deptName.includes('IT') || deptName.includes('Information')) return <Globe className="w-3.5 h-3.5" />;
    return <School className="w-3.5 h-3.5" />;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Today';
    }
  };

  const filterChips = ['All', ...DEPARTMENTS.map((d) => d.name)];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar (Material 3) */}
      <div className="bg-[#1e40af] text-white px-4 py-3 flex items-center justify-between shadow-md z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">
              Campus Notice Board
            </h1>
            <p className="text-[10px] text-blue-200">Official Student Circulars</p>
          </div>
        </div>

        <div className="flex items-center gap-1 relative">
          <button
            onClick={() => {
              onRefresh();
              showToast('Notices refreshed from storage');
            }}
            title="Refresh Notices"
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            title="More Options"
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Popup Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-700 text-xs">
              <button
                onClick={() => {
                  onLoadSampleData();
                  setShowMenu(false);
                  showToast('Sample notices loaded successfully');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-blue-700 font-medium flex items-center gap-2"
              >
                <span>📥 Load Sample Data</span>
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowMenu(false);
                  showToast('All notices cleared');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2"
              >
                <span>🗑️ Clear All Data</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-4 pt-3 pb-2 border-b border-slate-100 shadow-xs shrink-0">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notices by title or keywords..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs rounded-full pl-9 pr-8 py-2.5 border border-transparent focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Department Filter Chips */}
      <div className="bg-white px-3 py-2 border-b border-slate-200/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
        {filterChips.map((dept) => {
          const isSelected = selectedDepartment === dept;
          let label = dept;
          if (dept.includes('(') && dept.includes(')')) {
            label = dept.split('(')[1].replace(')', '');
          }

          return (
            <button
              key={dept}
              onClick={() => onSelectDepartment(dept)}
              className={`text-[11px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#1e40af] text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-800'
              }`}
            >
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              {label}
            </button>
          );
        })}
      </div>

      {/* Notice List Body / State Switcher */}
      <div className="flex-1 overflow-y-auto p-3.5 pb-24">
        {isLoading ? (
          /* Loading State */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-700">Loading campus notices...</p>
            <p className="text-[11px] text-slate-400 mt-1">Fetching offline storage records</p>
          </div>
        ) : errorMessage ? (
          /* Error State with Retry Button */
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Failed to Load Notices</h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-[240px] leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-[#1e40af] hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : notices.length === 0 ? (
          /* Empty State */
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-[#1e40af] border border-blue-100">
              <Inbox className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {searchQuery || selectedDepartment !== 'All'
                ? 'No Matching Notices'
                : 'Notice Board is Empty'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-[250px] leading-relaxed">
              {searchQuery || selectedDepartment !== 'All'
                ? 'No announcements match your search or department filter.'
                : 'No college announcements posted yet. Click below to publish your first notice.'}
            </p>
            <div className="flex flex-col gap-2 mt-5">
              {searchQuery || selectedDepartment !== 'All' ? (
                <button
                  onClick={() => {
                    onSearchChange('');
                    onSelectDepartment('All');
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAddNotice()}
                    className="px-4 py-2.5 bg-[#1e40af] hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post First Notice</span>
                  </button>
                  <button
                    onClick={onLoadSampleData}
                    className="px-4 py-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Or load sample data
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Populated Notice Cards List */
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {selectedDepartment === 'All' ? 'All Active Notices' : selectedDepartment}
              </span>
              <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                {notices.length} {notices.length === 1 ? 'Notice' : 'Notices'}
              </span>
            </div>

            {notices.map((notice) => {
              const color = getDeptColor(notice.department);
              return (
                <div
                  key={notice.id}
                  onClick={() => onNoticeClick(notice)}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 active:scale-[0.99] transition-all cursor-pointer group"
                >
                  {/* Top Badge & Date */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      style={{
                        backgroundColor: `${color}14`,
                        color: color,
                        borderColor: `${color}30`,
                      }}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 max-w-[200px] truncate"
                    >
                      {getDeptIcon(notice.department)}
                      <span className="truncate">{notice.department}</span>
                    </span>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium shrink-0">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(notice.publishedDate)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {notice.title}
                  </h3>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {notice.description}
                  </p>

                  {/* Read More footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span
                      style={{ color }}
                      className="font-semibold flex items-center gap-1 group-hover:underline"
                    >
                      Read full notice
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="text-[10px] text-slate-400">Tap to view</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => onOpenAddNotice()}
        className="absolute bottom-5 right-5 z-30 bg-[#1e40af] hover:bg-blue-800 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-semibold text-xs transition-transform active:scale-95 border border-white/20"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Post Notice</span>
      </button>
    </div>
  );
};
