import React, { useState } from 'react';
import {
  Terminal,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  X,
  Play,
  Package,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface RunGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunGuideModal: React.FC<RunGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Open Project in Android Studio',
      desc: 'Launch Android Studio > Click "Open" > Select the downloaded/extracted campus_notice_board folder.',
      cmd: '',
    },
    {
      title: '2. Fetch Flutter Dependencies',
      desc: 'Downloads provider, shared_preferences, intl, and flutter_lints packages.',
      cmd: 'flutter pub get',
    },
    {
      title: '3. Verify Code with Static Analysis',
      desc: 'Ensures no compilation warnings, missing imports, or type errors.',
      cmd: 'flutter analyze',
    },
    {
      title: '4. Run Automated Widget Tests',
      desc: 'Executes the included widget tests in test/widget_test.dart.',
      cmd: 'flutter test',
    },
    {
      title: '5. Launch on Android Emulator or Phone',
      desc: 'Connect your Android device with USB debugging enabled or start an AVD emulator.',
      cmd: 'flutter run',
    },
    {
      title: '6. Build Standalone Release APK for Demo',
      desc: 'Generates a production APK ready for installation on any Android phone.',
      cmd: 'flutter build apk --release',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1e40af] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Android Studio & Release APK Guide
              </h2>
              <p className="text-xs text-blue-100">
                Complete instructions for college project viva, setup, and deployment.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          {/* Quick Terminal Steps */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-[#1e40af]" />
              <span>Step-by-Step Terminal Execution</span>
            </h3>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={step.title}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all hover:border-blue-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>

                  {step.cmd && (
                    <div className="mt-2.5 flex items-center justify-between bg-slate-900 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-mono">
                      <span>$ {step.cmd}</span>
                      <button
                        onClick={() => copyCommand(step.cmd, idx)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* APK Output Location Callout */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
            <Package className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950">Where is the Release APK located?</h4>
              <p className="mt-1 leading-relaxed">
                After running <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">flutter build apk --release</code>, the installable APK will be generated at:
              </p>
              <div className="mt-2 bg-white/90 p-2 rounded-lg font-mono text-[11px] text-amber-950 border border-amber-200 selection:bg-amber-200">
                build/app/outputs/flutter-apk/app-release.apk
              </div>
              <p className="mt-1.5 text-amber-800 text-[11px]">
                You can directly share this APK file to your classmates or install it onto real smartphones!
              </p>
            </div>
          </div>

          {/* Architecture & Viva Q&A */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-[#1e40af]" />
              <span>College Viva & Presentation Defense Answers</span>
            </h3>

            <div className="space-y-3">
              <div className="bg-blue-50/50 border border-blue-200/60 rounded-2xl p-4 text-xs space-y-1.5">
                <p className="font-bold text-blue-950">
                  Q1: Why did you use Provider with ChangeNotifier instead of setState?
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Answer:</strong> With `setState()`, state is trapped inside a single widget. In our college notice board, when a notice is created in `AddNoticeScreen`, `HomeScreen` and `DepartmentsScreen` must immediately update without complex callback drilling. `NoticeProvider` acts as the single source of truth, notifying listeners whenever data is added, searched, or filtered.
                </p>
              </div>

              <div className="bg-blue-50/50 border border-blue-200/60 rounded-2xl p-4 text-xs space-y-1.5">
                <p className="font-bold text-blue-950">
                  Q2: How does the application work without an internet connection?
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Answer:</strong> All notices are serialized into structured JSON maps via `Notice.toJson()` and written to the device's persistent storage using `SharedPreferences`. The app reads this data during startup (`fetchNotices`), making it 100% functional offline without servers or internet reliance.
                </p>
              </div>

              <div className="bg-blue-50/50 border border-blue-200/60 rounded-2xl p-4 text-xs space-y-1.5">
                <p className="font-bold text-blue-950">
                  Q3: How are form validations and edge cases handled?
                </p>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Answer:</strong> The `AddNoticeScreen` utilizes Flutter&apos;s <code>GlobalKey&lt;FormState&gt;</code> and <code>TextFormField</code> validator callbacks. It enforces non-empty titles, minimum/maximum character boundaries, mandatory department selection, and sanitizes strings with <code>.trim()</code>. Notices cannot be posted until all field validators pass.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1e40af] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Got it, Back to App
          </button>
        </div>
      </div>
    </div>
  );
};
