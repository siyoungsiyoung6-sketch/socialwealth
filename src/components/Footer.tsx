import { Send, Mail } from 'lucide-react';
import { Gauge } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="sponsors" className="border-t border-white/5 bg-slate-950">
      {/* Sponsorship CTA strip */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-950 p-8 text-center sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
              <Send className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Direct Sponsorship Inquiries</h3>
              <p className="mt-1 text-sm text-slate-400">
                For brand partnerships, featured placements, and premium sponsorships, contact us directly on Telegram.
              </p>
            </div>
            <a
              href="https://t.me/Your_Telegram_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40"
            >
              <Send className="h-4 w-4" />
              @Your_Telegram_ID
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
              <Gauge className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">
              SocialWorth<span className="text-cyan-400"> AI</span>
            </span>
          </div>
          <p className="text-center text-xs text-slate-500">
            For direct sponsorships & partnerships, reach out via Telegram{' '}
            <a
              href="https://t.me/Your_Telegram_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-400 underline decoration-cyan-400/30 underline-offset-2"
            >
              @Your_Telegram_ID
            </a>
          </p>
          <p className="text-xs text-slate-600">© 2026 SocialWorth AI. All estimates are simulated.</p>
        </div>
      </div>
    </footer>
  );
}
