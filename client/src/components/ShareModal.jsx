import { useState } from "react";
import QRCode from "react-qr-code";
import { X, Copy, CheckCircle2 } from "lucide-react";

export default function ShareModal({ isOpen, onClose, url, title }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-border dark:border-border-dark w-full max-w-sm overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark">
          <h3 className="text-lg font-bold text-heading dark:text-white">
            Share Poll
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4">
            <QRCode value={url} size={180} />
          </div>
          <p className="text-center text-sm text-body dark:text-muted mb-6 font-medium">
            Scan this QR code to vote on: <br />
            <span className="text-heading dark:text-white font-bold">
              {title}
            </span>
          </p>

          <div className="w-full">
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Or copy link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 px-3 py-2.5 rounded-xl border border-border dark:border-border-dark bg-slate-50 dark:bg-slate-800 text-sm text-heading dark:text-white outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors flex-shrink-0"
              >
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
