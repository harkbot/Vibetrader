import React from 'react';
import { MarketAlert } from '../types';
import { 
  Bell, 
  ExternalLink, 
  Flame, 
  TrendingUp, 
  AlertCircle, 
  Clock,
  Radio,
  Sparkles,
  Zap,
  Target,
  ShieldCheck
} from 'lucide-react';

interface IntelligenceFeedProps {
  alerts: MarketAlert[];
}

const IntelligenceFeed: React.FC<IntelligenceFeedProps> = ({ alerts }) => {
  const severityStyles = {
    High: 'bg-rose-500/5 border-rose-500/20 text-rose-400 verdict-glow-avoid',
    Medium: 'bg-amber-500/5 border-amber-500/20 text-amber-400 verdict-glow-fair',
    Low: 'bg-sky-500/5 border-sky-500/20 text-sky-400 verdict-glow-good'
  };

  const typeIcons = {
    News: <Radio className="w-4 h-4" />,
    Technical: <TrendingUp className="w-4 h-4" />,
    Volatility: <Flame className="w-4 h-4" />,
    Sentiment: <AlertCircle className="w-4 h-4" />
  };

  if (alerts.length === 0) {
    return (
      <div className="glass-card p-16 text-center border-white/5 space-y-6">
        <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10">
          <Sparkles className="w-10 h-10 text-slate-700" />
        </div>
        <div className="max-w-xs mx-auto">
          <h3 className="text-xl font-black uppercase text-white tracking-tighter italic">Intelligence Engine Ready</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3 leading-relaxed">Add tickers to your tactical watchlist and trigger a neural scan to extract market signals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={`glass-card p-6 border flex flex-col group hover:border-white/20 transition-all ${severityStyles[alert.severity]}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 text-sky-400">{typeIcons[alert.type]}</div>
              <div>
                <span className="font-mono font-black text-xl text-white tracking-tighter uppercase">{alert.ticker}</span>
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">{alert.type} SIGNAL</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
              <Clock className="w-3 h-3" />
              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-black text-white text-sm mb-3 leading-tight tracking-tight uppercase italic">{alert.headline}</h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed mb-6 line-clamp-3">{alert.impactDescription}</p>
          </div>

          <div className="space-y-3 mb-6">
            {/* Tactical Advice for Active Positions */}
            {alert.tacticalAdvice && (
              <div className="bg-sky-500/10 border border-sky-500/30 p-4 rounded-2xl space-y-2 animate-in slide-in-from-right-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-sky-400 uppercase tracking-widest">
                   <Zap className="w-3 h-3 fill-sky-400" /> Active Position Management
                 </div>
                 <p className="text-xs text-sky-100 font-bold italic leading-relaxed">
                   "{alert.tacticalAdvice}"
                 </p>
              </div>
            )}

            {/* Entry Recommendation for New/All Tickers */}
            {alert.entryRecommendation && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-2 animate-in slide-in-from-right-4 delay-75">
                 <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                   <Target className="w-3 h-3 fill-emerald-400" /> Entry Recommendation
                 </div>
                 <p className="text-xs text-emerald-100 font-bold italic leading-relaxed">
                   "{alert.entryRecommendation}"
                 </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
             <div className="flex items-center gap-2">
               {alert.severity === 'High' && <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{alert.severity} PRIORITY</span>
             </div>
             {alert.sourceUrl && (
               <a 
                 href={alert.sourceUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors"
               >
                 INTEL SOURCE <ExternalLink className="w-3 h-3" />
               </a>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntelligenceFeed;