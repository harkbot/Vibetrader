import React from 'react';
import { LoggedTrade } from '../types';
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle2, 
  Trash2, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Coins,
  Settings,
  XCircle
} from 'lucide-react';

interface TradeJournalProps {
  trades: LoggedTrade[];
  onClear: () => void;
  onUpdateStatus: (id: string, status: 'Open' | 'Closed' | 'Discarded') => void;
  onManage: (trade: LoggedTrade) => void;
}

const TradeJournal: React.FC<TradeJournalProps> = ({ trades, onClear, onUpdateStatus, onManage }) => {
  if (trades.length === 0) {
    return (
      <div className="p-12 sm:p-24 text-center border-2 border-dashed border-slate-800 rounded-3xl">
        <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-slate-800 mx-auto mb-6" />
        <h3 className="text-xl sm:text-2xl font-black text-slate-600 uppercase tracking-tighter">Your Journal is Empty</h3>
        <p className="text-slate-500 mt-2 font-medium text-sm">Log a trade from the Audit tab to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="flex justify-end">
         <button 
           onClick={() => { if(confirm('Clear all trade history?')) onClear(); }}
           className="text-[9px] sm:text-[10px] font-black text-slate-500 hover:text-red-400 flex items-center gap-2 uppercase tracking-widest transition-colors"
         >
           <Trash2 className="w-3 h-3" />
           Clear History
         </button>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full">
        {trades.map((trade) => (
          <div 
            key={trade.id} 
            className="bg-slate-800/30 border border-slate-700/50 p-4 sm:p-6 rounded-3xl group hover:border-blue-500/50 transition-all flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 w-full relative"
          >
            <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 shadow-xl group-hover:scale-110 transition-transform shrink-0">
                 <span className="text-base sm:text-xl font-black font-mono text-blue-400">{trade.ticker}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight truncate">{trade.strategy}</h4>
                <div className="flex items-center gap-3 sm:gap-4 mt-1">
                   <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                     <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                     {new Date(trade.openDate).toLocaleDateString()}
                   </div>
                   <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                     trade.sentiment === 'Bullish' ? 'text-emerald-400' : trade.sentiment === 'Bearish' ? 'text-rose-400' : 'text-sky-400'
                   }`}>
                     {trade.sentiment === 'Bullish' ? <TrendingUp size={10} /> : trade.sentiment === 'Bearish' ? <TrendingDown size={10} /> : <Minus size={10} />}
                     {trade.sentiment}
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 w-full lg:w-auto bg-slate-900/50 p-3 sm:p-4 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar scroll-smooth">
               <div className="text-center px-3 sm:px-4 border-r border-slate-800 shrink-0">
                  <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase mb-0.5 sm:mb-1">DTE Entry</div>
                  <div className="font-mono font-bold text-white flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Clock size={12} className="text-orange-400 sm:size-[14px]" />
                    {trade.dte}
                  </div>
               </div>
               <div className="text-center px-3 sm:px-4 border-r border-slate-800 shrink-0">
                  <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase mb-0.5 sm:mb-1">Credit</div>
                  <div className="font-mono font-bold text-emerald-400 flex items-center justify-center gap-1 text-xs sm:text-sm">
                    <Coins size={12} className="sm:size-[14px]" />
                    ${trade.creditReceived || 0}
                  </div>
               </div>
               <div className="text-center px-3 sm:px-4 border-r border-slate-800 shrink-0">
                  <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase mb-0.5 sm:mb-1">Profit Trgt</div>
                  <div className="font-mono font-bold text-white flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Target size={12} className="text-blue-400 sm:size-[14px]" />
                    {trade.profitTarget}%
                  </div>
               </div>
               <div className="text-center px-3 sm:px-4 border-r border-slate-800 shrink-0">
                  <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase mb-0.5 sm:mb-1">GTC</div>
                  <div className={`font-mono font-bold flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs ${trade.gtcOrder ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle2 size={12} className="sm:size-[14px]" />
                    {trade.gtcOrder ? 'SET' : 'OFF'}
                  </div>
               </div>
               <div className="text-center px-3 sm:px-4 shrink-0">
                  <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase mb-0.5 sm:mb-1">Status</div>
                  <div className={`font-mono font-bold text-[9px] sm:text-[10px] uppercase ${trade.status === 'Open' ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`}>
                    {trade.status}
                  </div>
               </div>
            </div>

            {trade.status === 'Open' && (
              <div className="flex items-center gap-2 absolute top-2 right-2 lg:relative lg:top-0 lg:right-0">
                <button 
                  onClick={() => onManage(trade)}
                  className="bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white p-2 rounded-xl transition-all flex items-center gap-2 group/btn"
                >
                  <Settings size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest hidden lg:inline-block">Manage</span>
                </button>
                <button 
                  onClick={() => onUpdateStatus(trade.id, 'Closed')}
                  className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white p-2 rounded-xl transition-all flex items-center gap-2 group/btn"
                >
                  <XCircle size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest hidden lg:inline-block">Close Position</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeJournal;