import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Upload, RefreshCcw, PieChart as ChartIcon, Wallet, Wand2, Sparkles, Zap, Globe, 
  Link as LinkIcon, X, BookOpen, CheckCircle, Camera, Target, Plus, Activity, 
  Calendar, TrendingUp, TrendingDown, Radar, Trophy, Settings, XCircle, Clock, 
  Coins, Minus, ArrowUpRight, AlertTriangle, Search
} from 'lucide-react';
import { 
  analyzeTradeImages, fetchMarketIntelligence, generateDailyOutlook, 
  fetchTickerTrends, fetchTacticalOpportunities, getManagementAdvice 
} from './geminiService';
import { loginToBrokerage, getAccountData, getBalance } from './brokerageService';
import { 
  TradeAnalysis, ImageFile, AnalysisStatus, MarketAlert, MarketOutlook, 
  BrokerSession, LoggedTrade, TickerTrend, TacticalOpportunity, 
  BrokerageProvider, ManagementAdvice 
} from './types';
import Dashboard from './components/Dashboard';
import IntelligenceFeed from './components/IntelligenceFeed';
import DailyOutlookReport from './components/DailyOutlookReport';
import TradeJournal from './components/TradeJournal';

const TickerBanner = ({ trends, onTickerClick, activeTickers }: { trends: TickerTrend[], onTickerClick: (ticker: string) => void, activeTickers: string[] }) => {
  const displayTrends = trends && trends.length > 0 ? trends : [
    { symbol: 'SPY', change: '+0.12%', vibe: 'Neutral', note: '' },
    { symbol: 'QQQ', change: '+0.45%', vibe: 'Bullish', note: '' },
    { symbol: 'NVDA', change: '+1.20%', vibe: 'Bullish', note: '' },
    { symbol: 'IWM', change: '-0.30%', vibe: 'Bearish', note: '' },
  ] as TickerTrend[];

  return (
    <div className="w-full bg-slate-900/95 border-y border-white/5 py-3 overflow-hidden relative mb-8 backdrop-blur-2xl z-[40]">
      <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
        {[...displayTrends, ...displayTrends, ...displayTrends].map((trend, i) => (
          <button 
            key={`${trend.symbol}-${i}`} 
            onClick={() => onTickerClick(trend.symbol)}
            className="flex items-center gap-4 px-12 border-r border-white/5 last:border-0 group hover:bg-white/5 transition-all h-full py-1"
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white font-mono tracking-tighter uppercase group-hover:text-sky-400 transition-colors">{trend.symbol}</span>
                {activeTickers.includes(trend.symbol) && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {trend.vibe === 'Bullish' ? <TrendingUp size={14} className="text-emerald-400" /> : trend.vibe === 'Bearish' ? <TrendingDown size={14} className="text-rose-400" /> : <Activity size={14} className="text-sky-400" />}
              <span className={`text-[11px] font-black font-mono tracking-tight ${trend.vibe === 'Bullish' ? 'text-emerald-400' : trend.vibe === 'Bearish' ? 'text-rose-400' : 'text-sky-400'}`}>{trend.change}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Analysis' | 'Intelligence' | 'Tactical' | 'Journal'>('Analysis');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null);
  const [proactiveOpps, setProactiveOpps] = useState<TacticalOpportunity[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>("Put Selling");
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [trends, setTrends] = useState<TickerTrend[]>([]);
  const [baselineBalance, setBaselineBalance] = useState<number>(() => {
    const saved = localStorage.getItem('vibe_baseline_balance');
    return saved ? parseFloat(saved) : 45000.00;
  });
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [tempBalance, setTempBalance] = useState(baselineBalance.toString());
  const [syncedBalance, setSyncedBalance] = useState<number | null>(null);
  const [brokerSession, setBrokerSession] = useState<BrokerSession | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<BrokerageProvider>('Tastytrade');
  const [brokerEmail, setBrokerEmail] = useState('');
  const [brokerPassword, setBrokerPassword] = useState('');
  const [loggedTrades, setLoggedTrades] = useState<LoggedTrade[]>(() => {
    const saved = localStorage.getItem('vibe_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [loggingDetails, setLoggingDetails] = useState({ gtc: true, profitTarget: 50, creditReceived: 0, dte: 45 });
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('vibe_watchlist');
    return saved ? JSON.parse(saved) : ['SPY', 'QQQ', 'NVDA', 'IWM'];
  });
  const [newTicker, setNewTicker] = useState('');
  const [marketOutlook, setMarketOutlook] = useState<MarketOutlook | null>(null);
  const [managementAdvice, setManagementAdvice] = useState<ManagementAdvice | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const [currentManagingTrade, setCurrentManagingTrade] = useState<LoggedTrade | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { localStorage.setItem('vibe_journal', JSON.stringify(loggedTrades)); }, [loggedTrades]);
  useEffect(() => { localStorage.setItem('vibe_baseline_balance', baselineBalance.toString()); }, [baselineBalance]);
  useEffect(() => { localStorage.setItem('vibe_watchlist', JSON.stringify(watchlist)); }, [watchlist]);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const data = await fetchTickerTrends();
        if (data && data.length > 0) setTrends(data);
      } catch (e) { console.error(e); }
    };
    loadTrends();
    const interval = setInterval(loadTrends, 180000);
    return () => clearInterval(interval);
  }, []);

  const currentLiquidity = useMemo(() => {
    if (brokerSession && syncedBalance !== null) return syncedBalance;
    const totalCredits = loggedTrades.filter(t => t.status === 'Open').reduce((sum, t) => sum + (t.creditReceived || 0), 0);
    return baselineBalance + totalCredits;
  }, [baselineBalance, loggedTrades, brokerSession, syncedBalance]);

  const openPositionTickers = useMemo(() => loggedTrades.filter(t => t.status === 'Open').map(t => t.ticker), [loggedTrades]);
  const allIntelTickers = useMemo(() => Array.from(new Set([...watchlist, ...openPositionTickers])), [watchlist, openPositionTickers]);

  const performAnalysis = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setStatus(AnalysisStatus.ANALYZING);
    try {
      const base64Images = await Promise.all(files.map(async (file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }));
      const result = await analyzeTradeImages(base64Images, selectedStrategy);
      setAnalysis(result);
      setStatus(AnalysisStatus.IDLE);
    } catch (error) {
      console.error("Analysis error:", error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleLaunchScanner = async () => {
    setStatus(AnalysisStatus.SCANNING_OPPS);
    try {
      const opps = await fetchTacticalOpportunities(selectedStrategy);
      setProactiveOpps(opps);
      setStatus(AnalysisStatus.IDLE);
    } catch (e) { setStatus(AnalysisStatus.ERROR); }
  };

  const handleIntelScan = async () => {
    setStatus(AnalysisStatus.SCANNING_INTEL);
    try {
      const result = await fetchMarketIntelligence(allIntelTickers);
      setAlerts(result);
      setStatus(AnalysisStatus.IDLE);
    } catch (e) { setStatus(AnalysisStatus.ERROR); }
  };

  const handleGlobalOutlook = async () => {
    setStatus(AnalysisStatus.GENERATING_OUTLOOK);
    try {
      const outlook = await generateDailyOutlook();
      setMarketOutlook(outlook);
      setStatus(AnalysisStatus.IDLE);
    } catch (e) { setStatus(AnalysisStatus.ERROR); }
  };

  const handleManageTrade = async (trade: LoggedTrade) => {
    setCurrentManagingTrade(trade);
    setIsManaging(true);
    setManagementAdvice(null);
    try {
      const advice = await getManagementAdvice(trade);
      setManagementAdvice(advice);
    } catch (e) { console.error(e); }
  };

  const finalizeLogging = () => {
    if (!analysis) return;
    const newTrade: LoggedTrade = {
      id: crypto.randomUUID(),
      ticker: analysis.ticker,
      strategy: analysis.strategy,
      dte: loggingDetails.dte,
      openDate: new Date().toISOString(),
      status: 'Open',
      gtcOrder: loggingDetails.gtc,
      profitTarget: loggingDetails.profitTarget,
      sentiment: analysis.sentiment,
      creditReceived: loggingDetails.creditReceived
    };
    setLoggedTrades([newTrade, ...loggedTrades]);
    setIsLoggingModalOpen(false);
    setAnalysis(null);
    setActiveTab('Journal');
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setProactiveOpps([]);
    setStatus(AnalysisStatus.IDLE);
  };

  return (
    <div className="min-h-screen pb-40 px-2 sm:px-4 md:px-8 max-w-6xl mx-auto pt-6 flex flex-col w-full overflow-x-hidden">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 w-full px-2">
        <div className="flex items-center gap-4 self-start">
          <div className="bg-sky-600 p-3 rounded-2xl shadow-2xl shadow-sky-600/40 rotate-2 transition-transform hover:rotate-0">
            <ChartIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white italic">VIBETRADER</h1>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Neural Flow Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-center">
          <button onClick={() => setIsConnectModalOpen(true)} className="p-3 rounded-2xl border bg-slate-900 border-white/5 text-slate-500 hover:text-sky-400 transition-colors">
            <LinkIcon size={20} />
          </button>
          <div onClick={() => setIsBalanceModalOpen(true)} className="flex items-center gap-3 bg-slate-900 border border-white/5 p-3 rounded-2xl cursor-pointer hover:border-sky-500/30 transition-all">
            <Wallet className="w-5 h-5 text-sky-400" />
            <div className="flex flex-col">
              <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Capital</span>
              <span className="text-xs font-black font-mono text-white tracking-tighter">${currentLiquidity.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      <TickerBanner trends={trends} onTickerClick={(t) => { setActiveTab('Intelligence'); if(!watchlist.includes(t)) setWatchlist([...watchlist, t]); }} activeTickers={openPositionTickers} />

      <nav className="flex p-1.5 bg-slate-900/80 border border-white/10 rounded-3xl mb-12 sticky top-6 z-50 backdrop-blur-3xl overflow-x-auto no-scrollbar">
        {[
          {id: 'Analysis', icon: Wand2, label: 'Audit'},
          {id: 'Journal', icon: BookOpen, label: 'Journal'},
          {id: 'Intelligence', icon: Zap, label: 'Intel'},
          {id: 'Tactical', icon: Globe, label: 'Global'}
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id as any); setStatus(AnalysisStatus.IDLE); }} 
            className={`flex-1 min-w-[90px] px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${activeTab === tab.id ? 'bg-sky-600 text-white shadow-xl shadow-sky-600/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <tab.icon size={14}/><span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 w-full max-w-full">
        {activeTab === 'Analysis' && (
          <div className="space-y-6 pb-20">
            {/* Show error feedback if node fails */}
            {status === AnalysisStatus.ERROR && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl flex items-center justify-between gap-4 animate-in slide-in-from-top-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-500 p-2 rounded-xl text-white"><AlertTriangle size={20} /></div>
                  <div>
                    <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest">Neural Scan Error</h4>
                    <p className="text-[10px] font-medium text-slate-400 uppercase mt-1">Data node failed to respond. Check API_KEY or try again.</p>
                  </div>
                </div>
                <button onClick={resetAnalysis} className="text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors">Clear</button>
              </div>
            )}

            {status === AnalysisStatus.IDLE && !analysis && (
              <div className="space-y-10">
                <section className="glass-card p-8 border-sky-500/20 bg-sky-500/5">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-sky-600 p-3 rounded-xl rotate-3"><Radar className="w-8 h-8 text-white animate-pulse" /></div>
                      <div>
                        <h2 className="text-2xl font-black uppercase text-white italic">Premium Scanner</h2>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Identifying Tactical Entries</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <select value={selectedStrategy} onChange={(e) => setSelectedStrategy(e.target.value)} className="bg-slate-900 border border-white/10 text-white text-[10px] font-black uppercase px-5 py-3 rounded-2xl outline-none focus:border-sky-500">
                        <option>Put Selling</option><option>Strangles</option><option>Iron Condors</option><option>Covered Calls</option>
                      </select>
                      <button onClick={handleLaunchScanner} className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-xl shadow-sky-600/20 active:scale-95 transition-all"><Zap size={14} /> Neural Scan</button>
                    </div>
                  </div>
                  {proactiveOpps.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 animate-in slide-in-from-bottom-6">
                      {proactiveOpps.map((opp, i) => (
                        <div key={i} className="bg-slate-950/50 p-5 rounded-3xl border border-white/5 hover:border-sky-500/40 transition-all cursor-default group">
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-mono font-black text-white text-lg group-hover:text-sky-400 transition-colors uppercase tracking-tight">{opp.ticker}</span>
                            <span className="text-[10px] font-black text-emerald-400 font-mono tracking-tighter bg-emerald-500/10 px-2 py-1 rounded">{opp.ivRank}% IVR</span>
                          </div>
                          <p className="text-[10px] font-medium text-slate-400 leading-tight mb-4 italic line-clamp-2">"{opp.reason}"</p>
                          <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                            <span>{opp.strategy}</span>
                            <span className={opp.sentiment === 'Bullish' ? 'text-emerald-500' : 'text-rose-500'}>{opp.sentiment}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                <section className="glass-card p-12 text-center border-2 border-dashed border-white/5 cursor-pointer hover:border-sky-500/30 group transition-all" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} onChange={e => { if (e.target.files) performAnalysis(Array.from(e.target.files)); }} multiple accept="image/*" className="hidden" />
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-sky-600/10 transition-all"><Upload className="w-8 h-8 text-sky-400 group-hover:animate-bounce" /></div>
                  <h2 className="text-2xl font-black uppercase text-white italic">Trade Auditor</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Upload Screenshots to verify setup DNA</p>
                </section>
              </div>
            )}
            
            {(status === AnalysisStatus.SCANNING_OPPS || status === AnalysisStatus.ANALYZING) && (
              <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <RefreshCcw className="w-20 h-20 text-sky-500 animate-spin" strokeWidth={1} />
                <h2 className="text-3xl font-black uppercase text-white italic tracking-tighter text-center">
                  {status === AnalysisStatus.SCANNING_OPPS ? 'Extracting Chain Skew...' : 'Synthesizing Trade DNA...'}
                </h2>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-bounce"></span>
                </div>
              </div>
            )}

            {analysis && (
              <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-amber-400" />
                    <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Audit Intelligence</h2>
                  </div>
                  <button onClick={resetAnalysis} className="text-[9px] font-black text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-2 rounded-2xl border border-white/10 transition-all uppercase tracking-widest">Clear Audit</button>
                </div>
                <Dashboard analysis={analysis} />
                <div className="sticky bottom-8 z-50 px-4 max-w-lg mx-auto w-full">
                  <button onClick={() => setIsLoggingModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-4 uppercase shadow-2xl active:scale-95 transition-all"><CheckCircle className="w-7 h-7" /> Log Result</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Journal' && (
          <TradeJournal 
            trades={loggedTrades} 
            onClear={() => { if(confirm('Wipe History?')) setLoggedTrades([]); }} 
            onUpdateStatus={(id, s) => setLoggedTrades(loggedTrades.map(t => t.id === id ? {...t, status: s} : t))} 
            onManage={handleManageTrade} 
          />
        )}

        {activeTab === 'Intelligence' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <section className="glass-card p-8 border-white/5 bg-slate-900/40">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="font-black uppercase text-base text-white tracking-tight italic">Intelligence Hub</h3>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Neural monitoring across watchlist</p>
                </div>
                <button onClick={handleIntelScan} className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-sky-600/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Radar size={14} className="animate-pulse" /> Trigger Pulse Scan
                </button>
              </div>

              <div className="flex gap-2 mb-8 group">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Enter Ticker (e.g. MSTR)" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-mono text-white outline-none focus:border-sky-500 transition-all"
                    value={newTicker}
                    onChange={e => setNewTicker(e.target.value.toUpperCase())}
                    onKeyDown={e => {
                      if(e.key === 'Enter' && newTicker) {
                        if(!watchlist.includes(newTicker)) setWatchlist([...watchlist, newTicker]);
                        setNewTicker('');
                      }
                    }}
                  />
                </div>
                <button 
                  onClick={() => { if(newTicker) { if(!watchlist.includes(newTicker)) setWatchlist([...watchlist, newTicker]); setNewTicker(''); } }} 
                  className="bg-white/5 hover:bg-sky-600 text-slate-400 hover:text-white border border-white/10 p-4 rounded-2xl transition-all active:scale-95"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {allIntelTickers.map(t => (
                  <div key={t} className="flex items-center gap-3 bg-slate-950/60 border border-white/5 px-4 py-2.5 rounded-2xl group hover:border-sky-500/30 transition-all relative">
                    {openPositionTickers.includes(t) && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                    <span className="font-mono font-black text-[11px] text-white uppercase">{t}</span>
                    <button onClick={() => setWatchlist(watchlist.filter(w => w !== t))} className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </section>

            {status === AnalysisStatus.SCANNING_INTEL ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-6">
                <RefreshCcw className="w-12 h-12 text-sky-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Extracting News & Vol Signals...</p>
              </div>
            ) : <IntelligenceFeed alerts={alerts} />}
          </div>
        )}

        {activeTab === 'Tactical' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            {status === AnalysisStatus.GENERATING_OUTLOOK ? (
              <div className="py-40 flex flex-col items-center justify-center space-y-8">
                <Globe className="w-20 h-20 text-sky-500 animate-spin" strokeWidth={1} />
                <h2 className="text-3xl font-black uppercase text-white italic tracking-tighter text-center animate-pulse">Synthesizing Macro Session Briefing...</h2>
              </div>
            ) : !marketOutlook ? (
              <div className="glass-card p-20 text-center border-white/5 bg-slate-900/40">
                <Globe size={64} className="text-slate-800 mx-auto mb-8 animate-pulse-soft" />
                <h3 className="text-3xl font-black uppercase text-white italic tracking-tighter">Session Hub</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 mb-10 max-w-sm mx-auto leading-relaxed">Cross-referenced analysis of global futures and session catalysts.</p>
                <button onClick={handleGlobalOutlook} className="bg-sky-600 hover:bg-sky-500 text-white px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">Launch Session Briefing</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-end mb-4">
                  <button onClick={handleGlobalOutlook} className="text-[10px] font-black text-sky-400 flex items-center gap-2 hover:text-sky-300 transition-all uppercase tracking-widest"><RefreshCcw size={12} /> Regenerate Report</button>
                </div>
                <DailyOutlookReport outlook={marketOutlook} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistence Modals */}
      {isManaging && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
          <div className="glass-card w-full max-w-2xl p-10 border-sky-500/30 relative">
            <button onClick={() => setIsManaging(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            <div className="mb-10">
              <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">Tactical Adjustment Engine</span>
              <h3 className="text-4xl font-black uppercase text-white italic mt-3 tracking-tighter">{currentManagingTrade?.ticker} <span className="text-slate-600 text-2xl">/</span> {currentManagingTrade?.strategy}</h3>
            </div>
            {!managementAdvice ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
                <Radar className="w-20 h-20 text-sky-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Pinging Chain Skew & Delta...</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 bg-sky-600/5 border border-sky-500/20 rounded-[2rem] shadow-inner">
                  <div className="flex items-center gap-3 text-sky-400 mb-4 font-black uppercase text-xs tracking-widest"><Sparkles size={18} /> {managementAdvice.headline}</div>
                  <p className="text-base font-bold text-slate-200 leading-relaxed italic">"{managementAdvice.mechanicalAdvice}"</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Adjustment Tactics</div>
                    {managementAdvice.adjustmentTactics.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-sky-500/30 transition-all">
                        <ArrowUpRight size={18} className="text-sky-400 shrink-0" />
                        <span className="text-[13px] font-bold text-slate-300">{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 p-8 rounded-[2rem] space-y-6">
                    <div>
                      <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Buying Power Delta</div>
                      <div className="text-2xl font-mono font-black text-white tracking-tighter">{managementAdvice.buyingPowerImpact}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Neural Verdict</div>
                      <div className={`text-xl font-black uppercase tracking-tighter ${managementAdvice.verdict === 'Exit' ? 'text-rose-500' : managementAdvice.verdict === 'Adjust' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {managementAdvice.verdict} Path
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsManaging(false)} className="w-full bg-sky-600 hover:bg-sky-500 text-white py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Finalize Adjustment Strategy</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Persistence Modals */}
      {isLoggingModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
          <div className="glass-card w-full max-w-sm p-10 space-y-8 border-white/10 animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black uppercase text-white italic text-center tracking-tighter">Commit Trade</h3>
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Credit ($)</label>
                <input type="number" step="0.01" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-mono text-2xl outline-none text-center focus:border-emerald-500 transition-all" placeholder="0.00" value={loggingDetails.creditReceived || ''} onChange={e => setLoggingDetails({...loggingDetails, creditReceived: parseFloat(e.target.value) || 0})} />
              </div>
              <button onClick={finalizeLogging} className="w-full py-5 rounded-3xl font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-all uppercase text-sm shadow-2xl active:scale-95">Verify & Commit</button>
              <button onClick={() => setIsLoggingModalOpen(false)} className="w-full text-slate-500 font-black uppercase text-[10px] py-2 text-center hover:text-white transition-colors">Abort</button>
            </div>
          </div>
        </div>
      )}

      {isBalanceModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
          <div className="glass-card w-full max-w-sm p-10 space-y-8 border-white/10 animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black uppercase text-white italic text-center tracking-tighter">Account Setup</h3>
            <div className="space-y-6 text-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Baseline Liquidity ($)</label>
              <input type="number" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-mono text-2xl outline-none text-center focus:border-sky-500 transition-all" value={tempBalance} onChange={e => setTempBalance(e.target.value)} />
              <button onClick={() => { setBaselineBalance(parseFloat(tempBalance) || 0); setIsBalanceModalOpen(false); }} className="w-full py-5 rounded-3xl font-black text-white bg-sky-600 hover:bg-sky-500 uppercase text-sm shadow-2xl transition-all">Sync Baseline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;