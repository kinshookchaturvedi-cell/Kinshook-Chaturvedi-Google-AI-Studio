
import React, { useState } from 'react';
import { Country, InvestmentConcept, StockInfo, CFAReport, BacktestResult } from './types';
import { COUNTRIES, CONCEPT_CONFIGS } from './constants';
import { screenStocks, generateCFAReport, backtestStrategy, searchSpecificStock } from './services/geminiService';
import ArchitectureView from './components/ArchitectureView';
import ReportCard from './components/ReportCard';
import BacktestView from './components/BacktestView';

enum ViewState {
  HOME,
  RESULTS,
  REPORT,
  ARCH,
  BACKTEST
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Selection state
  const [selectedCountry, setSelectedCountry] = useState<string>('India');
  const [customCountry, setCustomCountry] = useState<string>('');
  const [selectedConcept, setSelectedConcept] = useState<InvestmentConcept | 'Custom'>(InvestmentConcept.GARP);
  const [stockCount, setStockCount] = useState(10);
  
  // Custom inputs
  const [customStrategy, setCustomStrategy] = useState<string>('');
  const [individualStockQuery, setIndividualStockQuery] = useState<string>('');
  
  // Data state
  const [results, setResults] = useState<StockInfo[]>([]);
  const [activeReport, setActiveReport] = useState<CFAReport | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);

  const effectiveCountry = selectedCountry === 'Other' ? customCountry : selectedCountry;

  const handleScreen = async (strategyOverride?: string) => {
    const finalStrategy = strategyOverride || (selectedConcept === 'Custom' ? customStrategy : selectedConcept);
    
    if (selectedCountry === 'Other' && !customCountry.trim()) {
      setError("Please enter a valid country name.");
      return;
    }
    if (!finalStrategy) {
      setError("Please select or enter an investment strategy.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await screenStocks(effectiveCountry, finalStrategy, stockCount);
      setResults(data);
      setView(ViewState.RESULTS);
    } catch (err) {
      setError("Failed to screen stocks. Market data retrieval failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleIndividualAnalysis = async () => {
    if (!individualStockQuery.trim()) {
      setError("Please enter a stock ticker or name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fixed: searchSpecificStock signature is (query, count, country). effectiveCountry was passed as count.
      const stockInfo = await searchSpecificStock(individualStockQuery, 1, effectiveCountry);
      if (stockInfo) {
        const report = await generateCFAReport(stockInfo);
        setActiveReport(report);
        setView(ViewState.REPORT);
      } else {
        setError("Could not locate specific security details for analysis.");
      }
    } catch (err) {
      setError("Analysis generation failed. Check connection or ticker validity.");
    } finally {
      setLoading(false);
    }
  };

  const handleBacktest = async () => {
    if (results.length === 0) {
      setError("Please run a Live Screen first to backtest the specific portfolio.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const finalStrategy = selectedConcept === 'Custom' ? customStrategy : selectedConcept;
      const data = await backtestStrategy(effectiveCountry, finalStrategy, results);
      setBacktestResult(data);
      setView(ViewState.BACKTEST);
    } catch (err) {
      setError("Backtesting engine error. Quantitative simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (stock: StockInfo) => {
    setLoading(true);
    setError(null);
    try {
      const report = await generateCFAReport(stock);
      setActiveReport(report);
      setView(ViewState.REPORT);
    } catch (err) {
      console.error("Report generation error:", err);
      setError("Analysis generation failed. AI model timeout or malformed data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStockCountChange = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setStockCount(1);
    } else {
      setStockCount(Math.min(50, Math.max(1, num)));
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
          <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">KC</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Kinshook Chaturvedi</span>
        </div>
        <div className="flex space-x-6 text-sm font-medium text-slate-600">
          <button onClick={() => setView(ViewState.HOME)} className={`hover:text-blue-600 ${view === ViewState.HOME ? 'text-blue-600' : ''}`}>Dashboard</button>
          <button onClick={() => setView(ViewState.ARCH)} className={`hover:text-blue-600 ${view === ViewState.ARCH ? 'text-blue-600' : ''}`}>System & Logic</button>
          <button className="hover:text-blue-600">Terminal</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-800 font-bold animate-pulse text-lg text-center px-4">Synchronizing Live Market Data & Backtesting...</p>
            <p className="text-slate-500 text-sm">Cross-verifying fundamentals via Global Terminals</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 flex items-center animate-shake">
            <i className="fas fa-exclamation-circle mr-3"></i>
            {error}
          </div>
        )}

        {view === ViewState.HOME && (
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h1 className="text-5xl serif font-bold text-slate-900 mb-4 tracking-tight">Kinshook Chaturvedi Stock Selection</h1>
              <p className="text-xl text-slate-600">Verified real-time screening & automated CFA quantitative research.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Target Jurisdiction</label>
                    <select 
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-800 font-medium mb-4"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {selectedCountry === 'Other' && (
                      <div className="mt-4 animate-fadeIn">
                        <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 ml-1">Manual Country Entry</label>
                        <input 
                          type="text"
                          placeholder="Enter Country Name..."
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    )}

                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Number of stocks</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="50" 
                          value={stockCount} 
                          onChange={(e) => handleStockCountChange(e.target.value)}
                          className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold text-blue-600 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <input 
                        type="range" min="1" max="50" 
                        value={stockCount} 
                        onChange={(e) => setStockCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-bold">
                        <span>FOCUSED (1)</span>
                        <span>BROAD (50)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg text-center">
                    <h3 className="font-bold text-white mb-3 flex items-center justify-center">
                      <i className="fas fa-search-dollar mr-2 text-blue-300"></i>
                      Execution Engine
                    </h3>
                    <p className="text-xs text-blue-100 leading-relaxed mb-6">
                      Engaging Google Search for verified real-time pricing and fundamental integrity across {effectiveCountry || 'selected'} exchanges.
                    </p>
                    <button 
                      onClick={() => handleScreen()}
                      className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-md hover:bg-blue-400 shadow-xl transition-all transform active:scale-[0.98]"
                    >
                      Run Live Screen
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 px-2">Investment Strategy Selection</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.keys(CONCEPT_CONFIGS) as InvestmentConcept[]).map(concept => (
                      <button
                        key={concept}
                        onClick={() => setSelectedConcept(concept)}
                        className={`flex items-start p-5 border rounded-2xl transition-all text-left group ${
                          selectedConcept === concept 
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600' 
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className={`text-3xl mr-5 transition-transform group-hover:scale-110 ${selectedConcept === concept ? 'scale-110' : ''}`}>
                          {CONCEPT_CONFIGS[concept].icon}
                        </div>
                        <div>
                          <div className={`font-bold mb-1 ${selectedConcept === concept ? 'text-blue-900' : 'text-slate-800'}`}>{concept}</div>
                          <div className="text-xs text-slate-500 leading-tight">{CONCEPT_CONFIGS[concept].description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced & Individual Analysis Section */}
            <div className="bg-slate-900 rounded-2xl shadow-xl p-10 text-white border border-slate-700">
              <h2 className="text-2xl serif font-bold mb-8 flex items-center">
                <i className="fas fa-microchip mr-4 text-blue-400"></i>
                Advanced & Custom Research Terminal
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Custom Investment Strategy */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Custom Investment Strategy</h3>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="e.g., Renewable Energy Turnarounds in Emerging Markets..."
                      value={customStrategy}
                      onChange={(e) => {
                        setCustomStrategy(e.target.value);
                        setSelectedConcept('Custom');
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 pr-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-white placeholder:text-slate-500"
                    />
                    <button 
                      onClick={() => handleScreen(customStrategy)}
                      className="absolute right-3 top-3 bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <i className="fas fa-play text-xs"></i>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Enter any custom qualitative concept to trigger a deep-grounded screening process.</p>
                </div>

                {/* Individual Stock Analysis */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Individual Stock Deep-Dive</h3>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Enter Stock Name or Ticker (e.g. RELIANCE, TSLA)..."
                      value={individualStockQuery}
                      onChange={(e) => setIndividualStockQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 pr-12 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-white placeholder:text-slate-500"
                    />
                    <button 
                      onClick={handleIndividualAnalysis}
                      className="absolute right-3 top-3 bg-slate-700 hover:bg-slate-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-slate-600"
                    >
                      <i className="fas fa-magnifying-glass text-xs"></i>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Instantly generate a full CFA-compliant research report for a single security using real-time filings.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === ViewState.RESULTS && (
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <button onClick={() => setView(ViewState.HOME)} className="text-blue-600 font-semibold mb-2 hover:underline inline-flex items-center">
                  <i className="fas fa-chevron-left mr-2"></i> Adjust Parameters
                </button>
                <h2 className="text-3xl font-bold text-slate-900">Live Rankings: {selectedConcept === 'Custom' ? customStrategy : selectedConcept}</h2>
                <div className="flex items-center space-x-3 mt-1">
                   <span className="text-slate-500">{effectiveCountry} Market Analysis</span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                   <span className="text-green-600 font-bold flex items-center">
                     <i className="fas fa-check-circle mr-1"></i> VERIFIED LIVE DATA
                   </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleBacktest}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center hover:bg-slate-900 shadow-lg shadow-blue-100 transition-all"
                >
                  <i className="fas fa-history mr-2"></i> BACKTEST THIS PORTFOLIO
                </button>
                <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-mono text-xs flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  G-GROUNDING ACTIVE
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rank / Security</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Sector Vertical</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Live Pricing (USD)</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Alpha Density (1-10)</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Intelligence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((stock, idx) => (
                      <tr key={stock.ticker} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-6">
                          <div className="flex items-center">
                            <span className="text-slate-300 font-bold mr-6 text-xl">{(idx + 1).toString().padStart(2, '0')}</span>
                            <div>
                              <div className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{stock.name}</div>
                              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">{stock.ticker} • {stock.exchange}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 uppercase">{stock.sector}</span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="font-mono font-bold text-slate-800 text-base">{stock.price}</div>
                          <div className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">
                            <i className="fas fa-clock mr-1"></i> {stock.lastUpdated || 'RECENT'}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center mb-1.5">
                              <span className="font-mono font-bold text-slate-900 mr-3 text-lg">{stock.score.toFixed(1)}</span>
                              <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div className="h-full bg-blue-600 shadow-sm transition-all duration-1000" style={{ width: `${stock.score * 10}%` }}></div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">INSTITUTIONAL RANK</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <button 
                            onClick={() => handleGenerateReport(stock)}
                            className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white shadow transition-all whitespace-nowrap flex items-center mx-auto"
                          >
                            <i className="fas fa-file-invoice mr-2"></i> GEN REPORT
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === ViewState.REPORT && activeReport && (
          <ReportCard report={activeReport} onBack={() => setView(results.length > 0 ? ViewState.RESULTS : ViewState.HOME)} />
        )}

        {view === ViewState.BACKTEST && backtestResult && (
          <BacktestView result={backtestResult} onBack={() => setView(ViewState.RESULTS)} />
        )}

        {view === ViewState.ARCH && (
          <ArchitectureView />
        )}
      </main>

      {/* Persistent Status Bar */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-slate-200 py-3 px-8 flex justify-between items-center text-[10px] text-slate-500 font-bold tracking-widest z-40 shadow-2xl">
        <div className="flex items-center space-x-6">
          <span className="flex items-center text-blue-600">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            AI ENGINE: GEMINI 3 FLASH (SEARCH + CROSS-VERIFY)
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center uppercase">
            <i className="fas fa-shield-halved mr-2 text-slate-400"></i>
            Compliance: CFA Research Essentials v2025
          </span>
        </div>
        <div className="uppercase">
          &copy;  Kinshook Chaturvedi Institutional Analysis
        </div>
      </footer>
    </div>
  );
};

export default App;
