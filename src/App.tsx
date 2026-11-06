import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Maximize2,
  FileCode,
  BookOpen,
  Download,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  Layers,
  Sparkles,
  School,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Terminal,
} from 'lucide-react';
import { Notice, INITIAL_SAMPLE_NOTICES } from './types/notice';
import { storageService } from './services/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { HomeScreenSim } from './components/HomeScreenSim';
import { NoticeDetailSim } from './components/NoticeDetailSim';
import { AddNoticeSim } from './components/AddNoticeSim';
import { DepartmentsSim } from './components/DepartmentsSim';
import { CodeViewerModal } from './components/CodeViewerModal';
import { RunGuideModal } from './components/RunGuideModal';

export default function App() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'detail' | 'add' | 'departments'>('home');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialDeptForAdd, setInitialDeptForAdd] = useState<string | undefined>();
  const [bottomNavIndex, setBottomNavIndex] = useState<number>(0);

  // Simulation states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Modals
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Load notices from localStorage on mount
  useEffect(() => {
    const saved = storageService.loadNotices();
    if (saved && saved.length > 0) {
      setNotices(saved);
    } else {
      // Default to initial sample notices so the reviewer immediately sees the full app,
      // but they can clear it anytime to test the empty state as required
      storageService.saveNotices(INITIAL_SAMPLE_NOTICES);
      setNotices(INITIAL_SAMPLE_NOTICES);
    }
  }, []);

  // Filter notices based on selected department and search query
  const filteredNotices = notices.filter((notice) => {
    const matchesDept =
      selectedDepartment === 'All' ||
      notice.department.toLowerCase() === selectedDepartment.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesSearch;
  });

  const handleSaveNotice = (newNotice: Notice) => {
    const updated = storageService.addNotice(newNotice);
    setNotices(updated);
    setCurrentScreen('home');
  };

  const handleDeleteNotice = (id: string) => {
    const updated = storageService.deleteNotice(id);
    setNotices(updated);
    setSelectedNotice(null);
    setCurrentScreen('home');
  };

  const handleLoadSampleData = () => {
    storageService.saveNotices(INITIAL_SAMPLE_NOTICES);
    setNotices(INITIAL_SAMPLE_NOTICES);
    setErrorMessage(null);
    setIsLoading(false);
  };

  const handleClearAllData = () => {
    storageService.clearAll();
    setNotices([]);
    setSelectedNotice(null);
  };

  const handleOpenAddNotice = (dept?: string) => {
    setInitialDeptForAdd(dept);
    setCurrentScreen('add');
  };

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    setCurrentScreen('detail');
  };

  const simulateLoadingToggle = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const simulateErrorToggle = () => {
    setIsLoading(false);
    setErrorMessage('Failed to connect to local cache database. (Simulated Test)');
  };

  const handleRetry = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setNotices(storageService.loadNotices());
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Banner & Control Deck */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & College Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">
                  Campus Notice Board
                </h1>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold px-2 py-0.5 rounded-full">
                  Flutter 3.35+ • Material 3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Offline-capable College Project with Provider & SharedPreferences
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Flutter Code & ZIP</span>
            </button>

            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Run & APK Guide</span>
            </button>

            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title={isPhoneFrame ? 'Switch to Full Screen View' : 'Switch to Phone Frame'}
            >
              {isPhoneFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Simulator Toolbar Controls */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs gap-3">
          {/* State Simulation Helpers */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tester Controls:
            </span>

            <button
              onClick={simulateLoadingToggle}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <PlayCircle className="w-3 h-3 text-blue-400" />
              <span>Test Loading State</span>
            </button>

            <button
              onClick={simulateErrorToggle}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Test Error & Retry</span>
            </button>

            <button
              onClick={handleClearAllData}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>Test Empty State</span>
            </button>

            <button
              onClick={handleLoadSampleData}
              className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-[11px] font-medium border border-blue-500/30 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3 text-blue-400" />
              <span>Reset Sample Data</span>
            </button>
          </div>

          {/* Quick Notice Count */}
          <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
            <span>
              Total Notices: <strong className="text-white">{notices.length}</strong>
            </span>
            <span>•</span>
            <span>
              Offline DB: <strong className="text-emerald-400">Ready</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col justify-center items-center p-3 md:p-6 overflow-hidden">
        <AndroidFrame isPhoneFrame={isPhoneFrame}>
          {/* Screen Router */}
          {currentScreen === 'home' && bottomNavIndex === 0 && (
            <HomeScreenSim
              notices={filteredNotices}
              selectedDepartment={selectedDepartment}
              onSelectDepartment={setSelectedDepartment}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onNoticeClick={handleNoticeClick}
              onOpenAddNotice={handleOpenAddNotice}
              onRefresh={handleRetry}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onRetry={handleRetry}
              onLoadSampleData={handleLoadSampleData}
              onClearAllData={handleClearAllData}
            />
          )}

          {bottomNavIndex === 1 && currentScreen === 'home' && (
            <DepartmentsSim
              notices={notices}
              onNoticeClick={handleNoticeClick}
              onOpenAddNotice={handleOpenAddNotice}
              onBackToHome={() => setBottomNavIndex(0)}
            />
          )}

          {currentScreen === 'detail' && selectedNotice && (
            <NoticeDetailSim
              notice={selectedNotice}
              onBack={() => setCurrentScreen('home')}
              onDeleteNotice={handleDeleteNotice}
            />
          )}

          {currentScreen === 'add' && (
            <AddNoticeSim
              initialDepartment={initialDeptForAdd}
              onBack={() => setCurrentScreen('home')}
              onSaveNotice={handleSaveNotice}
            />
          )}

          {/* Bottom Navigation Bar (When on home or departments screen) */}
          {currentScreen === 'home' && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-1.5 px-6 flex justify-around items-center z-20 shadow-lg">
              <button
                onClick={() => setBottomNavIndex(0)}
                className={`flex flex-col items-center gap-0.5 text-xs font-semibold py-1 px-4 rounded-xl transition-colors ${
                  bottomNavIndex === 0
                    ? 'text-[#1e40af]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div
                  className={`px-4 py-1 rounded-full transition-colors ${
                    bottomNavIndex === 0 ? 'bg-blue-100 text-[#1e40af]' : ''
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px]">All Notices</span>
              </button>

              <button
                onClick={() => setBottomNavIndex(1)}
                className={`flex flex-col items-center gap-0.5 text-xs font-semibold py-1 px-4 rounded-xl transition-colors ${
                  bottomNavIndex === 1
                    ? 'text-[#1e40af]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div
                  className={`px-4 py-1 rounded-full transition-colors ${
                    bottomNavIndex === 1 ? 'bg-blue-100 text-[#1e40af]' : ''
                  }`}
                >
                  <School className="w-4 h-4" />
                </div>
                <span className="text-[10px]">Departments</span>
              </button>
            </div>
          )}
        </AndroidFrame>
      </main>

      {/* Code Viewer and Project Zip Exporter Modal */}
      <CodeViewerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Android Studio and APK Build Guide Modal */}
      <RunGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
