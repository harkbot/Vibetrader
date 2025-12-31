
import React from 'react';
import { AdjustmentResult } from '../types';
import { 
  ArrowRight, 
  CheckSquare, 
  Scale, 
  Thermometer, 
  Target,
  Sparkles
} from 'lucide-react';

interface AdjustmentDashboardProps {
  result: AdjustmentResult;
}

const AdjustmentDashboard: React.FC<AdjustmentDashboardProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 mt-12 pt-12 border-t border-slate-700/50">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Adjustment Lab: Analysis Complete</h2>
      </div>

      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 p-8 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Verdict & Score */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 text-center">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Optimization Score</div>
              <div className="text-6xl font-black text-purple-400 font-mono">{result.improvementRating}<span className="text-2xl text-slate-600">/10</span></div>
              <p className="mt-4 text-sm font-medium text-slate-300 leading-relaxed italic">
                "{result.summaryVerdict}"
              </p>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg"><Target className="w-5 h-5 text-blue-400" /></div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Delta Shift</div>
                <div className="text-sm font-medium text-slate-200">{result.deltaShift}</div>
              </div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
              <div className="p-2 bg-orange-500/10 rounded-lg"><Thermometer className="w-5 h-5 text-orange-400" /></div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Theta Impact</div>
                <div className="text-sm font-medium text-slate-200">{result.thetaImpact}</div>
              </div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-start gap-4 md:col-span-2">
              <div className="p-2 bg-green-500/10 rounded-lg"><Scale className="w-5 h-5 text-green-400" /></div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Risk Profile Update</div>
                <div className="text-sm font-medium text-slate-200">{result.riskImpact}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Changes Detected List */}
        <div className="mt-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Detected Modifications
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.changesFound.map((change, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-200 text-sm font-medium">{change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentDashboard;
