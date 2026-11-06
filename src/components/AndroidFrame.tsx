import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  currentTime?: string;
  isPhoneFrame?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  currentTime = '10:30',
  isPhoneFrame = true,
}) => {
  if (!isPhoneFrame) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-50 overflow-hidden shadow-sm">
        {/* Top Minimal Bar */}
        <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-400">Android 14 (API 34) Preview</span>
            <span className="text-slate-400 text-[11px]">• Campus Notice Board</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span>{currentTime}</span>
            <Wifi className="w-3.5 h-3.5" />
            <Signal className="w-3.5 h-3.5" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative flex flex-col">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto my-auto flex flex-col items-center">
      {/* Device Body */}
      <div className="w-[390px] h-[800px] max-h-[92vh] bg-slate-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col relative select-none">
        {/* Outer Bezel buttons simulation */}
        <div className="absolute -left-[5px] top-28 w-[5px] h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[5px] top-44 w-[5px] h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-[5px] top-32 w-[5px] h-16 bg-slate-700 rounded-r-md" />

        {/* Inner Screen */}
        <div className="w-full h-full bg-[#f8fafc] rounded-[34px] overflow-hidden flex flex-col relative border border-slate-800/20">
          {/* Android Status Bar */}
          <div className="bg-[#1e40af] text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs z-30 select-none">
            <span className="font-medium tracking-wide text-[13px]">{currentTime}</span>
            {/* Front Camera Punch-hole */}
            <div className="w-4 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-2 text-white/90">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 overflow-hidden relative flex flex-col bg-[#f8fafc]">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="w-full bg-[#f8fafc] py-2 flex justify-center items-center select-none border-t border-slate-100">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
