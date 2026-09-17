import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Terminal } from 'lucide-react';

interface TerminalLogProps {
  logs: string[];
  simplifiedLogs?: string[];
}

export const TerminalLog: React.FC<TerminalLogProps> = ({
  logs,
  simplifiedLogs = [
    'Connecting to ESP32...',
    'ESP32 detected.',
    'Preparing flash...',
    'Writing firmware...',
    'Verifying firmware...',
    'Restarting device...',
  ],
}) => {
  const [showTechnical, setShowTechnical] = useState(false);
  const [copied, setCopied] = useState(false);
  const rawLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rawLogRef.current && showTechnical) {
      rawLogRef.current.scrollTop = rawLogRef.current.scrollHeight;
    }
  }, [logs, showTechnical]);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/80 backdrop-blur-md overflow-hidden text-left shadow-2xl font-mono">
      {/* Simplified User Progress Feed */}
      <div className="p-4 border-b border-white/5 space-y-1.5 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-firday-cyan font-semibold text-[11px] uppercase tracking-wider mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>Activity Log</span>
        </div>
        {simplifiedLogs.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-firday-cyan">&gt;</span>
            <span className="text-slate-200">{entry}</span>
          </div>
        ))}
      </div>

      {/* Expandable Technical Details Button */}
      <div className="px-4 py-2.5 bg-white/[0.02] flex items-center justify-between">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="flex items-center gap-1.5 text-xs text-firday-dim hover:text-white transition-colors cursor-pointer"
        >
          {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>Technical Details</span>
        </button>

        {showTechnical && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-firday-dim hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Logs'}</span>
          </button>
        )}
      </div>

      {/* Raw Technical Logs (Collapsed by Default) */}
      {showTechnical && (
        <div
          ref={rawLogRef}
          className="p-4 bg-black/90 max-h-48 overflow-y-auto space-y-1 text-[11px] text-slate-400 border-t border-white/5 scroll-smooth"
        >
          {logs.length === 0 ? (
            <span className="italic text-firday-dim">No raw output yet...</span>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="truncate">
                <span className="text-firday-dim mr-2">&gt;</span>
                {l}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
