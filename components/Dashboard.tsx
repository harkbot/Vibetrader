import React from 'react';
import { TradeAnalysis } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Activity,
  ArrowRightLeft,
  Clock,
  Target,
  Trophy,
  Zap,
  ArrowRight,
  Scale
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  analysis: TradeAnalysis;
}

const Dashboard: React.FC<DashboardProps> = ({ analysis }) => {
  const verdictStyles = {
    Good: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 verdict-glow-good',
    Fair: 'text-amber-400 border-amber-500/30 bg-amber-500/5 verdict-glow-fair',
    Avoid: 'text-rose-400 border-rose-500/30 bg-rose-500/5 verdict-glow-avoid'
  };

  const chartData = [
    { name: 'Risk', value: 40 },
    { name: 'Reward', value: 60 }
  ];
  const COLORS = ['#ef4444', '#10b981'];

  const dte = analysis.dte || 45;
  const exitTargetDays = Math.max(0, dte - 21);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-full overflow-x-hidden">
      {/* Strategic Pivot Suggestion */}
      {analysis.pivotSuggestion && (
        <div className="glass-card p-6 border-2 border-sky-500/40 bg-sky-500/10 animate-in bounce-in duration-500">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center shadow-xl shadow-sky-600/20 shrink-0 rotate-3">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">Mathematical Pivot Suggestion</span>
                <div className="flex items-center gap-2 font-black font-mono text-white text-sm">
                  <span className="opacity-50 line-through">{analysis.strategy}</span>
                  <ArrowRight size={14} className="text-sky-400" />
                  <span className="text-emerald-400">{analysis.pivotSuggestion.suggestedStrategy}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-200 leading-relaxed mb-4 italic">
                "{analysis.pivotSuggestion.reason}"
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="text-[8px] text-slate-500 uppercase font-black">Risk Efficiency Gain</div>
                    <div className="text-emerald-400 font-mono font-black">{analysis.pivotSuggestion.efficiencyGain}</div>
                  </div>
                  <Zap size={14} className="text-amber-400 fill-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Verdict Card */}
      <div className={`p-5 sm:p-8 glass-card border-2 transition-all duration-500 ${verdictStyles[analysis.verdict]}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
              {analysis.verdict === 'Good' && <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />}
              {analysis.verdict === 'Fair' && <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />}
              {analysis.verdict === 'Avoid' && <XCircle className="w-8 h-8 sm:w-10 sm:h-10" />}
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic">{analysis.verdict}</h2>
              <p className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase opacity-60">Neural Trade Audit</p>
            </div>
          </div>
          <div className="bg-white/5 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="text-[8px] sm:text-[10px] opacity-50 uppercase font-black tracking-widest mb-0.5 text-center">Primary Tactic</div>
            <div className="text-base sm:text-xl font-mono font-bold text-white text-center">{analysis.strategy}</div>
          </div>
        </div>
        <p className="text-base sm:text-lg leading-relaxed font-medium text-slate-200 pl-3 border-l-2 border-white/10">
          {analysis.reasoning}
        </p>
      </div>

      {/* Verified Alternatives */}
      {analysis.verdict !== 'Good' && analysis.alternativeTickers && analysis.alternativeTickers.length > 0 && (
        <div className="glass-card p-5 sm:p-6 border border-sky-500/20 bg-sky-500/5 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sky-400">
              <ArrowRightLeft className="w-4 h-4" />
              <span className="font-black uppercase tracking-widest text-[10px]">
                Verified Alternatives (IVR &gt; 30)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.alternativeTickers.map((t, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-4 py-2.5 rounded-xl group hover:border-sky-500/50 transition-all cursor-default">
                <span className="text-sm font-black text-white font-mono">{t}</span>
                <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">High IV</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 sm:p-6 border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-6 sm:mb-8">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-black uppercase tracking-widest text-[9px] sm:text-[10px]">Trade DNA</span>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center group">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Ticker</span>
              <span className="text-2xl font-black font-mono text-white tracking-tighter">{analysis.ticker}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">IV Rank</span>
              <span className={`text-2xl font-black font-mono ${analysis.ivRank > 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {analysis.ivRank}%
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6 border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-slate-400 mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-black uppercase tracking-widest text-[9px]">Capital Efficiency</span>
          </div>
          <div className="h-36 sm:h-44 relative z-10">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={8} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">R/R Index</span>
              <span className="text-xl font-black font-mono text-white">{analysis.riskRewardRatio}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6 border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-4 sm:mb-6">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-black uppercase tracking-widest text-[9px]">Hazard Monitor</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[7px] text-slate-500 uppercase font-black">Earnings Window</div>
                <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${exitTargetDays > 24 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {analysis.earningsDate ? (exitTargetDays > 24 ? 'Safe Window' : 'Binary Risk') : 'No Catalyst'}
                </div>
              </div>
              <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                {analysis.earningsDate || 'N/A'}
                <CheckCircle2 className={`w-3 h-3 ${analysis.earningsDate ? 'text-emerald-400' : 'text-slate-600'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-2 text-emerald-400 mb-6 font-black uppercase text-[10px]">
          <Trophy className="w-4 h-4" /> Management Rules
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
            <div>
              <div className="text-[7px] text-emerald-500/60 uppercase font-black mb-1">Management Floor</div>
              <div className="text-2xl font-black font-mono text-white">40%</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500/40" />
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/40 flex items-center justify-between">
            <div>
              <div className="text-[7px] text-emerald-400 uppercase font-black mb-1">Profit Objective</div>
              <div className="text-2xl font-black font-mono text-emerald-400">50%</div>
            </div>
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;