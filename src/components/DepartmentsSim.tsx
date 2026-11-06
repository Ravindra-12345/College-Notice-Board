import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Calendar,
  School,
  Code2,
  Cpu,
  Zap,
  Cog,
  Building,
  Globe,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { Notice, DEPARTMENTS } from '../types/notice';

interface DepartmentsSimProps {
  notices: Notice[];
  onNoticeClick: (notice: Notice) => void;
  onOpenAddNotice: (initialDepartment?: string) => void;
  onBackToHome: () => void;
}

export const DepartmentsSim: React.FC<DepartmentsSimProps> = ({
  notices,
  onNoticeClick,
  onOpenAddNotice,
  onBackToHome,
}) => {
  const [selectedDeptDetail, setSelectedDeptDetail] = useState<string | null>(null);

  const getDeptIcon = (deptName: string) => {
    if (deptName.includes('CSE') || deptName.includes('Computer')) return <Code2 className="w-5 h-5" />;
    if (deptName.includes('ECE') || deptName.includes('Electronics')) return <Cpu className="w-5 h-5" />;
    if (deptName.includes('EEE') || deptName.includes('Electrical')) return <Zap className="w-5 h-5" />;
    if (deptName.includes('Mechanical')) return <Cog className="w-5 h-5" />;
    if (deptName.includes('Civil')) return <Building className="w-5 h-5" />;
    if (deptName.includes('IT') || deptName.includes('Information')) return <Globe className="w-5 h-5" />;
    return <School className="w-5 h-5" />;
  };

  const getDeptNoticeCount = (deptName: string) => {
    return notices.filter(
      (n) => n.department.toLowerCase() === deptName.toLowerCase()
    ).length;
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

  // If a department is selected, show department-filtered notice feed
  if (selectedDeptDetail) {
    const deptInfo = DEPARTMENTS.find((d) => d.name === selectedDeptDetail) || DEPARTMENTS[0];
    const deptNotices = notices.filter(
      (n) => n.department.toLowerCase() === selectedDeptDetail.toLowerCase()
    );

    return (
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative overflow-hidden">
        {/* Top App Bar themed to department */}
        <div
          style={{ backgroundColor: deptInfo.color }}
          className="text-white px-3 py-3 flex items-center justify-between shadow-md z-20 shrink-0"
        >
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedDeptDetail(null)}
              className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="truncate">
              <h2 className="text-sm font-bold tracking-tight truncate">{deptInfo.code} Notices</h2>
              <p className="text-[10px] text-white/80">{deptNotices.length} active announcements</p>
            </div>
          </div>

          <button
            onClick={() => onOpenAddNotice(selectedDeptDetail)}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
            title="Post notice to this department"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Department Info Header Banner */}
        <div
          style={{ backgroundColor: `${deptInfo.color}15` }}
          className="p-3.5 border-b border-slate-200/80 flex items-center gap-3 shrink-0"
        >
          <div
            style={{ backgroundColor: `${deptInfo.color}25`, color: deptInfo.color }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          >
            {getDeptIcon(deptInfo.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 style={{ color: deptInfo.color }} className="text-xs font-bold truncate">
              {deptInfo.name}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Showing official circulars and notices for this engineering department.
            </p>
          </div>
        </div>

        {/* Department Notices List */}
        <div className="flex-1 overflow-y-auto p-3.5 pb-20 space-y-3">
          {deptNotices.length === 0 ? (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 text-slate-400">
                <Inbox className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">No Notices for {deptInfo.code}</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                No announcements published yet for this branch. Be the first faculty or student coordinator to post!
              </p>
              <button
                onClick={() => onOpenAddNotice(selectedDeptDetail)}
                style={{ backgroundColor: deptInfo.color }}
                className="mt-4 px-4 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post to {deptInfo.code}</span>
              </button>
            </div>
          ) : (
            deptNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => onNoticeClick(notice)}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] text-slate-400">
                  <span
                    style={{ color: deptInfo.color }}
                    className="font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    {deptInfo.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatDate(notice.publishedDate)}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-700">
                  {notice.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {notice.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span style={{ color: deptInfo.color }} className="font-semibold flex items-center gap-1">
                    Read details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative overflow-hidden">
      {/* Top App Bar */}
      <div className="bg-[#1e40af] text-white px-4 py-3 flex items-center justify-between shadow-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="p-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-tight">Academic Departments</span>
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="flex-1 overflow-y-auto p-3.5 pb-24 space-y-3.5">
        {/* Banner card */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-4 text-white shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-200">
            College Engineering Branches
          </h2>
          <p className="text-sm font-extrabold mt-0.5">Explore Department Portals</p>
          <p className="text-[11px] text-blue-100/90 mt-1 leading-relaxed">
            Select your department below to view filtered notices, semester updates, and exam circulars.
          </p>
        </div>

        {/* 6 Department Cards in 2 columns */}
        <div className="grid grid-cols-2 gap-2.5">
          {DEPARTMENTS.map((dept) => {
            const count = getDeptNoticeCount(dept.name);
            return (
              <div
                key={dept.name}
                onClick={() => setSelectedDeptDetail(dept.name)}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between h-[155px]"
              >
                {/* Top Row: Icon and Code Badge */}
                <div className="flex items-center justify-between">
                  <div
                    style={{ backgroundColor: `${dept.color}15`, color: dept.color }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  >
                    {getDeptIcon(dept.name)}
                  </div>
                  <span
                    style={{ backgroundColor: dept.color }}
                    className="text-[10px] font-extrabold text-white px-2 py-0.5 rounded-md tracking-wider shadow-2xs"
                  >
                    {dept.code}
                  </span>
                </div>

                {/* Name */}
                <div className="my-1">
                  <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {dept.name}
                  </h3>
                </div>

                {/* Bottom Row: Notice count and arrow */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span
                    style={{ color: count > 0 ? dept.color : '#94a3b8' }}
                    className="font-bold text-[10px]"
                  >
                    {count} {count === 1 ? 'Notice' : 'Notices'}
                  </span>
                  <ChevronRight
                    style={{ color: dept.color }}
                    className="w-3.5 h-3.5"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
