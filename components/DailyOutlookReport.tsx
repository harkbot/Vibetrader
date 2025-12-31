import React, { useState } from 'react';
import { MarketOutlook, WatchlistItem } from '../types';
import { 
  Globe, 
  BarChart3, 
  Calendar, 
  Zap, 
  Mail, 
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Info,
  ArrowUpRight,
  Sparkles,
  X,
  Clock
} from 'lucide-react';

interface DailyOutlookReportProps {
  outlook: MarketOutlook;
}

const DailyOutlookReport: React.FC<DailyOutlookReportProps> = ({ outlook }) => {
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);

  const safeFutures = outlook?.futuresLevels || [];
  const safeEvents = outlook?.highImpactEvents || [];
  const safeWatchlist = outlook?.technicalWatchlist || [];

  const sendEmail = () => {
    const subject = `Tactical Market Briefing - ${outlook?.targetSession || 'Update'}`;
    const body = `
TACTICAL MARKET BRIEFING: ${outlook?.targetSession || 'N/A'}
Generated on: ${outlook?.reportDate || new Date().toLocaleDateString()}

GLOBAL MACRO VIBE:
${outlook?.globalMacroVibe || 'No data'}

FUTURES UPDATE:
${safeFutures.map(f => `${f.symbol}: ${f.price} (${f.change}) - ${f.vibe}`).join('\n')}

HIGH IMPACT EVENTS:
${safeEvents.map(e => `${e.day}: ${e.event} (${e.impact}) - ${e.details}`).join('\n')}

OPENING BELL FORECAST:
${outlook?.openingBellForecast || 'No data'}

WATCHLIST:
${safeWatchlist.map(t => `${t.ticker}: ${t.catalyst}`).join('\n')}
    `;
    window.location.href = `mailto:harkavym@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-700 relative text-white px-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Globe className="w-8 h-8 text-sky-500" />
            Tactical Briefing
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={12} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target: {outlook?.targetSession || 'Next Session'}</span>
          </div>
        </div>
        <button 
          onClick={sendEmail}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20 w-full md:w-auto justify-center"
        >
          <Mail className="w-4 h-4" />
          Send Briefing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macro Vibe */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700 p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Globe className="w-24 h-24 text-sky-400 rotate-12" />
          </div>
          <div className="flex items-center gap-2 text-sky-400 mb-4 font-black uppercase tracking-widest text-[10px]">
            <Share2 className="w-4 h-4" /> Market Pulse
          </div>
          <p className="text-xl leading-relaxed text-slate-200 font-medium italic relative z-10">
            "{outlook?.globalMacroVibe || 'Gathering session sentiment signals...'}"
          </p>
        </div>

        {/* Futures Snapshot */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 mb-6 font-black uppercase tracking-widest text-[10px]">
            <BarChart3 className="w-4 h-4" /> Futures Feed
          </div>
          <div className="space-y-3">
            {safeFutures.length > 0 ? (
              safeFutures.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <div className="font-mono font-black text-white">{f.symbol}</div>
                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Current Level</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-base">{f.price || 'N/A'}</div>
                    <div className={`text-[10px] font-black flex items-center justify-end gap-1 ${
                      f.vibe === 'Bullish' ? 'text-emerald-400' : f.vibe === 'Bearish' ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {f.vibe === 'Bullish' && <TrendingUp className="w-3 h-3" />}
                      {f.vibe === 'Bearish' && <TrendingDown className="w-3 h-3" />}
                      {f.vibe === 'Flat' && <Minus className="w-3 h-3" />}
                      {f.change || '--'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[10px] text-slate-500 uppercase font-black py-4 border border-dashed border-white/5 rounded-xl">Searching for real-time futures...</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* High Impact Events */}
        <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-3xl">
          <div className="flex items-center gap-2 text-rose-400 mb-6 font-black uppercase tracking-widest text-[10px]">
            <Calendar className="w-5 h-5" /> High Impact Catalysts
          </div>
          <div className="space-y-4">
            {safeEvents.length > 0 ? (
              safeEvents.map((e, i) => (
                <div key={i} className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                  <div className="flex flex-col items-center justify-center bg-slate-800 rounded-xl px-3 py-2 shrink-0 border border-white/5">
                    <span className="text-[10px] uppercase font-black text-slate-500">{e?.day?.slice(0, 3) || '??'}</span>
                    <span className="font-black text-xl text-sky-400">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white text-sm">{e?.event || 'Unknown Event'}</h4>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                        e?.impact === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                      }`}>
                        {e?.impact || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{e?.details || 'Details pending macro analysis...'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-[10px] uppercase font-black py-8 border border-dashed border-white/10 rounded-2xl italic">No high-impact alerts detected for the next 24h.</p>
            )}
          </div>
        </div>

        {/* Opening Bell Forecast & Watchlist */}
        <div className="space-y-6">
          <div className="bg-sky-600/10 border border-sky-500/30 p-8 rounded-3xl shadow-lg relative overflow-hidden group hover:border-sky-500/50 transition-all">
            <Zap className="absolute -right-4 -top-4 w-24 h-24 text-sky-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            <div className="flex items-center gap-2 text-sky-400 mb-4 font-black uppercase tracking-widest text-[10px] relative z-10">
              <TrendingUp className="w-4 h-4" /> Strategic Bias
            </div>
            <p className="text-slate-200 text-lg font-medium leading-relaxed relative z-10 italic">
              {outlook?.openingBellForecast || 'Generating session opening forecast...'}
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-3xl">
            <div className="flex items-center gap-2 text-slate-400 mb-4 font-black uppercase tracking-widest text-[10px]">
              <Sparkles className="w-4 h-4 text-amber-400" /> God Candle Watchlist
            </div>
            <div className="space-y-2">
              {safeWatchlist.length > 0 ? (
                safeWatchlist.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedItem(item)}
                    className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-2xl transition-all hover:border-sky-500 hover:bg-slate-800 group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-mono font-black text-xl text-sky-400 w-16 uppercase">{item?.ticker || '???'}</div>
                      <div className="hidden sm:block">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Catalyst</div>
                        <div className="text-sm text-slate-200 line-clamp-1">{item?.catalyst || 'Analyst Bias Adjustment'}</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-sky-400 transition-colors" />
                  </button>
                ))
              ) : (
                <p className="text-center text-[10px] text-slate-500 uppercase font-black py-4 italic">Watchlist generation pending...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-sky-900/20 to-transparent">
              <div>
                <div className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] mb-1">Session Intelligence</div>
                <h3 className="text-4xl font-black font-mono tracking-tighter">{selectedItem.ticker}</h3>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-black uppercase tracking-widest text-[10px]">
                  <Sparkles className="w-4 h-4" /> Alpha Catalyst
                </div>
                <div className="p-6 bg-amber-400/5 border border-amber-400/20 rounded-2xl">
                  <p className="text-xl font-bold text-white leading-tight">
                    {selectedItem.catalyst || 'Scanning current headlines for catalysts...'}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-black uppercase tracking-widest text-[10px]">
                    <TrendingUp className="w-4 h-4" /> Technical Profile
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    {selectedItem.technicalSetup || 'Bias remains neutral until the opening bell volatility resolves.'}
                  </p>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 font-black uppercase tracking-widest text-[10px]">
                    <Info className="w-4 h-4" /> Neural Deep Dive
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    {selectedItem.deepDive || 'Synthesizing market sentiment from active social and news feeds...'}
                  </p>
                </section>
              </div>

              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700 text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                  Vibe check passed. Manage at 40%. Exit at 21 DTE.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyOutlookReport;