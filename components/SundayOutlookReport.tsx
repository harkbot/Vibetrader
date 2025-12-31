
import React, { useState } from 'react';
// SundayOutlook was missing in types.ts, replaced with MarketOutlook which has the identical required structure.
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
  X
} from 'lucide-react';

interface SundayOutlookReportProps {
  // Use MarketOutlook as it correctly defines the properties needed by this component.
  outlook: MarketOutlook;
}

const SundayOutlookReport: React.FC<SundayOutlookReportProps> = ({ outlook }) => {
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);

  const sendEmail = () => {
    const subject = `Sunday Futures Outlook - ${new Date().toLocaleDateString()}`;
    const body = `
GLOBAL MACRO VIBE:
${outlook.globalMacroVibe}

FUTURES UPDATE:
${outlook.futuresLevels.map(f => `${f.symbol}: ${f.price} (${f.change}) - ${f.vibe}`).join('\n')}

HIGH IMPACT EVENTS:
${outlook.highImpactEvents.map(e => `${e.day}: ${e.event} (${e.impact}) - ${e.details}`).join('\n')}

OPENING BELL FORECAST:
${outlook.openingBellForecast}

WATCHLIST:
${outlook.technicalWatchlist.map(t => `${t.ticker}: ${t.catalyst}`).join('\n')}
    `;
    window.location.href = `mailto:harkavym@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-700 relative text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-500" />
          Sunday Evening Outlook
        </h2>
        <button 
          onClick={sendEmail}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Mail className="w-4 h-4" />
          Send to harkavym@gmail.com
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macro Vibe */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 text-blue-400 mb-4 font-black uppercase tracking-widest text-[10px]">
            <Share2 className="w-4 h-4" /> Global Macro Vibe
          </div>
          <p className="text-xl leading-relaxed text-slate-200 font-medium italic">
            "{outlook.globalMacroVibe}"
          </p>
        </div>

        {/* Futures Snapshot */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 text-orange-400 mb-6 font-black uppercase tracking-widest text-[10px]">
            <BarChart3 className="w-4 h-4" /> Futures Snapshot
          </div>
          <div className="space-y-4">
            {outlook.futuresLevels.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <div className="font-mono font-black text-white">{f.symbol}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Current Level</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-lg">{f.price}</div>
                  <div className={`text-[10px] font-black flex items-center justify-end gap-1 ${
                    f.vibe === 'Bullish' ? 'text-green-400' : f.vibe === 'Bearish' ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {f.vibe === 'Bullish' && <TrendingUp className="w-3 h-3" />}
                    {f.vibe === 'Bearish' && <TrendingDown className="w-3 h-3" />}
                    {f.vibe === 'Flat' && <Minus className="w-3 h-3" />}
                    {f.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* High Impact Events */}
        <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-3xl">
          <div className="flex items-center gap-2 text-red-400 mb-6 font-black uppercase tracking-widest text-[10px]">
            <Calendar className="w-5 h-5" /> High Impact Week Events
          </div>
          <div className="space-y-4">
            {outlook.highImpactEvents.map((e, i) => (
              <div key={i} className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center justify-center bg-slate-800 rounded-xl px-3 py-2 shrink-0">
                  <span className="text-[10px] uppercase font-black text-slate-500">{e.day.slice(0, 3)}</span>
                  <span className="font-black text-xl">{i + 1}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white">{e.event}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                      e.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {e.impact} IMPACT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{e.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opening Bell Forecast & Watchlist */}
        <div className="space-y-6">
          <div className="bg-blue-600/10 border border-blue-500/30 p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <Zap className="absolute -right-4 -top-4 w-24 h-24 text-blue-500/10 rotate-12" />
            <div className="flex items-center gap-2 text-blue-400 mb-4 font-black uppercase tracking-widest text-[10px] relative z-10">
              <TrendingUp className="w-4 h-4" /> Opening Bell Forecast
            </div>
            <p className="text-slate-200 text-lg font-medium leading-relaxed relative z-10 italic">
              {outlook.openingBellForecast}
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-3xl">
            <div className="flex items-center gap-2 text-slate-400 mb-4 font-black uppercase tracking-widest text-[10px]">
              <Sparkles className="w-4 h-4 text-yellow-400" /> "God Candle" Watchlist & Catalysts
            </div>
            <div className="space-y-2">
              {outlook.technicalWatchlist.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedItem(item)}
                  className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-2xl transition-all hover:border-blue-500 hover:bg-slate-800 group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-mono font-black text-xl text-blue-400 w-16 uppercase">{item.ticker}</div>
                    <div className="hidden sm:block">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Catalyst</div>
                      <div className="text-sm text-slate-200 line-clamp-1">{item.catalyst}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-transparent">
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Deep Dive Intelligence</div>
                <h3 className="text-4xl font-black font-mono tracking-tighter">{selectedItem.ticker}</h3>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-yellow-400 font-black uppercase tracking-widest text-[10px]">
                  <Sparkles className="w-4 h-4" /> Market Catalyst
                </div>
                <div className="p-6 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl">
                  <p className="text-xl font-bold text-white leading-tight">
                    {selectedItem.catalyst}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px]">
                    <TrendingUp className="w-4 h-4" /> Technical Setup
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    {selectedItem.technicalSetup}
                  </p>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 font-black uppercase tracking-widest text-[10px]">
                    <Info className="w-4 h-4" /> Vibe Check
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    {selectedItem.deepDive}
                  </p>
                </section>
              </div>

              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700 text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                  Trade mechanical. High frequency. Small sizing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SundayOutlookReport;
