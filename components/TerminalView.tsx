
import React, { useState, useEffect, useRef } from 'react';
import { MarketPulse, Country } from '../types';
import { getMarketPulse } from '../services/geminiService';

interface TerminalViewProps {
  country: Country;
  onCommand: (cmd: string) => void;
  onAnalyzeTicker: (ticker: string) => void;
}

const TerminalView: React.FC<TerminalViewProps> = ({ country, onCommand, onAnalyzeTicker }) => {
  const [pulse, setPulse] = useState<MarketPulse | null>(null);
  const [loading, setLoading] = useState(true);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>(['SESSION_INITIALIZED: READY', 'SYSTEM: GROUNDING ACTIVE']);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const data = await getMarketPulse(country);
        setPulse(data);
      } catch (err) {
        setHistory(prev => [...prev, 'ERROR: FAILED TO FETCH MARKET PULSE']);
      } finally {
        setLoading(false);
      }
    };
    fetchPulse();
  }, [country]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCmdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    const cleanCmd = command.trim().toUpperCase();
    setHistory(prev => [...prev, `> ${cleanCmd}`]);
    
    if (cleanCmd.startsWith('ANALYZE ')) {
      const ticker = cleanCmd.replace('ANALYZE ', '');
      onAnalyzeTicker(ticker);
    } else {
      onCommand(cleanCmd);
    }
    setCommand('');
  };

  return (
    <div className="bg-slate-950 text-emerald-500 font-mono h-[80vh] rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl animate-fadeIn">
      {/* Terminal Header */}
      <div className="bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-4 text-[10px] font-bold">
          <span className="text-slate-400">KC TERMINAL v2.5</span>
          <span className="text-slate-600">|</span>
          <span>LOCATION: {country.toUpperCase()}</span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span> LIVE</span>
        </div>
        <div className="text-[10px] text-slate-500">SECURE SHELL CONNECTION</div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Data Feed */}
        <div className="flex-[2] p-6 space-y-8 overflow-y-auto border-r border-slate-900 custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <span className="animate-pulse">SYNCHRONIZING GLOBAL DATA FEED...</span>
            </div>
          ) : (
            <>
              {/* Macro Indicators */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pulse?.macro?.map((m, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg">
                    <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-tighter">{m.indicator}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{m.value}</span>
                      <i className={`fas fa-caret-${m.trend === 'up' ? 'up text-emerald-500' : 'down text-rose-500'}`}></i>
                    </div>
                  </div>
                ))}
              </section>

              {/* Market Trending */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-900 pb-2">Active Securities & Sentiment</h3>
                <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-900/30">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-600 border-b border-slate-900">
                        <th className="px-4 py-3">TICKER</th>
                        <th className="px-4 py-3 text-right">PRICE</th>
                        <th className="px-4 py-3 text-right">CHG</th>
                        <th className="px-4 py-3 text-right">SENTIMENT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {pulse?.trending?.map((t, i) => (
                        <tr key={i} className="hover:bg-slate-900 transition-colors cursor-pointer group" onClick={() => onAnalyzeTicker(t.ticker)}>
                          <td className="px-4 py-3 font-bold text-emerald-400 group-hover:text-white underline decoration-dotted">{t.ticker}</td>
                          <td className="px-4 py-3 text-right text-white">{t.price}</td>
                          <td className={`px-4 py-3 text-right ${t.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{t.change}</td>
                          <td className="px-4 py-3 text-right text-[10px] font-bold uppercase">{t.sentiment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* News Flash */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-900 pb-2">Institutional Intelligence Feed</h3>
                <div className="space-y-3">
                  {pulse?.news?.map((n, i) => (
                    <div key={i} className="flex space-x-4 items-start group">
                      <span className="text-slate-700 text-[10px] mt-1 whitespace-nowrap">{n.timestamp}</span>
                      <div className="flex-1">
                        <div className="text-xs text-slate-300 group-hover:text-emerald-400 cursor-pointer transition-colors">{n.headline}</div>
                        <div className="text-[9px] text-slate-600 uppercase tracking-tighter mt-0.5">{n.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Console / Log Side */}
        <div className="flex-1 bg-black p-4 flex flex-col">
          <div className="text-[9px] text-slate-600 uppercase font-black mb-4 border-b border-slate-900 pb-2">System Console Log</div>
          <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-mono leading-tight custom-scrollbar" ref={scrollRef}>
            {history.map((h, i) => (
              <div key={i} className={h.startsWith('>') ? 'text-white' : h.startsWith('ERROR') ? 'text-rose-500' : 'text-emerald-700'}>
                {h}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleCmdSubmit} className="bg-black border-t border-slate-900 flex items-center px-4">
        <span className="text-emerald-500 mr-3 font-bold text-sm">CMD:</span>
        <input 
          autoFocus
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="TYPE TICKER TO ANALYZE OR COMMAND (E.G., 'RELIANCE', 'ANALYZE AAPL')..."
          className="bg-transparent flex-1 py-4 text-sm text-white outline-none placeholder:text-slate-800"
        />
        <div className="text-[8px] text-slate-700 font-bold hidden md:block">ENTER TO EXECUTE // ESC TO CLEAR</div>
      </form>
    </div>
  );
};

export default TerminalView;
