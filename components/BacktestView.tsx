
import React from 'react';
import { BacktestResult } from '../types';

interface BacktestViewProps {
  result: BacktestResult;
  onBack: () => void;
}

const BacktestView: React.FC<BacktestViewProps> = ({ result, onBack }) => {
  return (
    <div className="animate-fadeIn max-w-6xl mx-auto mb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <button onClick={onBack} className="text-blue-600 font-bold mb-2 hover:underline flex items-center">
            <i className="fas fa-chevron-left mr-2"></i> Dashboard
          </button>
          <h2 className="text-4xl serif font-bold text-slate-900 tracking-tight">Strategy Simulation Analysis</h2>
          <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mt-1">
            {result.concept} • {result.country} • {result.period}
          </p>
        </div>
        <div className="bg-slate-900 text-white p-4 rounded-xl text-center min-w-[150px]">
          <div className="text-xs text-slate-400 font-bold mb-1">STRATEGY RETURN</div>
          <div className="text-3xl font-bold text-green-400">+{result.strategyReturn}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Key Metrics Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <i className="fas fa-chart-line mr-3 text-blue-600"></i>
              Hypothetical Performance vs. Benchmark
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Benchmark Return</span>
                <span className="text-xl font-bold text-slate-800">+{result.benchmarkReturn}%</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Alpha Generated</span>
                <span className="text-xl font-bold text-blue-600">+{ (result.strategyReturn - result.benchmarkReturn).toFixed(1) }%</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Sharpe Ratio</span>
                <span className="text-xl font-bold text-slate-800">{result.sharpeRatio}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Max Drawdown</span>
                <span className="text-xl font-bold text-red-600">{result.maxDrawdown}%</span>
              </div>
            </div>

            <div className="mt-10">
              <h4 className="font-bold text-slate-800 mb-4">Quantitative Analysis Summary</h4>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm italic border-l-4 border-blue-600 pl-6 py-2">
                "{result.analysis}"
              </p>
            </div>
          </div>

          {/* Top Performers Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Historical Attribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.topPerformers.map((stock, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mr-3">{idx + 1}</span>
                    <span className="font-bold text-slate-900">{stock.ticker}</span>
                  </div>
                  <span className="text-green-600 font-mono font-bold">+{stock.return}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sources & Methodology */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-blue-900 text-white rounded-2xl p-8 shadow-xl">
            <h3 className="font-bold mb-4 flex items-center">
              <i className="fas fa-microscope mr-2 text-blue-300"></i>
              Methodology
            </h3>
            <ul className="space-y-4 text-xs text-blue-100">
              <li className="flex items-start">
                <i className="fas fa-check-circle mr-3 mt-1 text-blue-400"></i>
                Simulated 3-year performance reconstructed from historical pricing data.
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mr-3 mt-1 text-blue-400"></i>
                Risk parameters adjusted for standard volatility in {result.country} local markets.
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mr-3 mt-1 text-blue-400"></i>
                Verified via Search grounding across financial news archives and public records.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 text-sm">Grounding Sources</h3>
            <div className="space-y-3">
              {result.sources?.map((s, i) => (
                <a 
                  key={i} 
                  href={s.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-[10px] text-blue-600 hover:underline truncate bg-blue-50/50 p-2 rounded border border-blue-100 font-medium"
                >
                  <i className="fas fa-link mr-1"></i> {s.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-200 text-center space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Institutional Compliance & Legal Disclosure</p>
        <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium max-w-4xl mx-auto">
          All investments in the securities market are subject to market risks. The content provided is for informational and educational purposes only and should not be construed as investment advice. Investors are advised to read all related documents carefully and consult their own independent financial adviser before making any investment decisions. The company/platform assumes no liability for any losses incurred. Past performance is not indicative of future results.
        </p>
        <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest pt-4 border-t border-slate-50">
          HYPOTHETICAL HISTORICAL RESULTS RECONSTRUCTED VIA AI SYNTHESIS OF PUBLIC DATA
        </div>
      </div>
    </div>
  );
};

export default BacktestView;
