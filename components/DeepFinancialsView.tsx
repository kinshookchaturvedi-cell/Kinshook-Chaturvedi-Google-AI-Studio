
import React from 'react';
import { DeepFinancials, StockInfo } from '../types';

interface DeepFinancialsViewProps {
  stock: StockInfo;
  data: DeepFinancials;
  onBack: () => void;
}

const QuarterlyCell: React.FC<{ value: number; qoq: number }> = ({ value, qoq }) => (
  <td className="px-6 py-4 text-right">
    <div className="text-[10px] font-mono font-bold text-slate-900">{value?.toLocaleString() || "0"}</div>
    <div className={`text-[8px] font-black ${qoq >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
      {qoq > 0 ? '+' : ''}{qoq?.toFixed(1) || "0.0"}% QoQ
    </div>
  </td>
);

const DeepFinancialsView: React.FC<DeepFinancialsViewProps> = ({ stock, data, onBack }) => {
  return (
    <div className="animate-fadeIn max-w-7xl mx-auto mb-20 space-y-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <button onClick={onBack} className="text-blue-600 font-black mb-4 hover:underline flex items-center text-[10px] uppercase tracking-widest">
            <i className="fas fa-arrow-left mr-2"></i> Back to Report
          </button>
          <h2 className="text-4xl serif font-bold text-slate-900 uppercase">{stock.name}</h2>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] mt-2">Deep Financial Repository • {stock.ticker}</p>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex items-center space-x-6">
          <div className="text-center">
            <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">M-Cap</div>
            <div className="text-xl font-bold">{stock.marketCap}</div>
          </div>
          <div className="w-px h-10 bg-slate-800"></div>
          <div className="text-center">
            <div className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Price</div>
            <div className="text-xl font-bold">{stock.price}</div>
          </div>
        </div>
      </div>

      {/* 1. Annual Report Summary */}
      <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-8 py-5 flex items-center justify-between">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center">
            <i className="fas fa-file-invoice mr-3 text-blue-400"></i> Executive Annual Summary
          </h3>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Fiscal Year 2024/25 Audit</span>
        </div>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed font-medium italic border-l-4 border-blue-600 pl-6 py-2">
              {data?.executiveSummary?.summary || "No executive summary available for the selected fiscal period."}
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-4">Strategic Highlights</h4>
            <div className="space-y-3">
              {data?.executiveSummary?.highlights?.length > 0 ? (
                data.executiveSummary.highlights.map((h, i) => (
                  <div key={i} className="flex items-start space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <i className="fas fa-check-circle text-emerald-500 mt-0.5 text-[10px]"></i>
                    <span className="text-[10px] font-bold text-slate-700">{h}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">No specific highlights extracted.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 9-Year Financial Data */}
      <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-8 py-5 flex items-center">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest">
            <i className="fas fa-history mr-3 text-blue-400"></i> 9-Year Comparative Performance (YoY Growth)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Fiscal Year</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Revenue</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Rev YoY %</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">EBITDA</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">PAT (Net)</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">PAT YoY %</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">EPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.historical9Y?.length > 0 ? (
                data.historical9Y.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-[10px] font-black text-slate-900">{row.year}</td>
                    <td className="px-6 py-4 text-[10px] font-mono font-bold text-slate-700 text-right">{row.revenue?.toLocaleString() || "0"}</td>
                    <td className={`px-6 py-4 text-[10px] font-mono font-black text-right ${row.revenueYoY >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {row.revenueYoY > 0 ? '+' : ''}{row.revenueYoY}%
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono font-bold text-slate-700 text-right">{row.ebitda?.toLocaleString() || "0"}</td>
                    <td className="px-6 py-4 text-[10px] font-mono font-bold text-slate-700 text-right">{row.pat?.toLocaleString() || "0"}</td>
                    <td className={`px-6 py-4 text-[10px] font-mono font-black text-right ${row.patYoY >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {row.patYoY > 0 ? '+' : ''}{row.patYoY}%
                    </td>
                    <td className="px-8 py-4 text-[10px] font-mono font-black text-blue-600 text-right">{row.eps?.toFixed(2) || "0.00"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-8 text-center text-xs text-slate-400 italic">No historical data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. 6-Quarter Deep Statement Analysis */}
      <section className="space-y-8">
        <h3 className="text-xl serif font-bold text-slate-900 flex items-center">
          <i className="fas fa-layer-group mr-4 text-blue-600"></i>
          6-Quarter Multi-Statement Deep-Dive (QoQ Comparative)
        </h3>

        <div className="grid grid-cols-1 gap-8">
          {/* Quarterly Income Statement */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Condensed Income Statement</span>
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Full Parameter QoQ Analysis</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-8 py-3 text-[9px] font-black text-white uppercase tracking-widest">Metric</th>
                    {data?.quarterly6Q?.map((q, i) => <th key={i} className="px-6 py-3 text-[9px] font-black text-white uppercase tracking-widest text-right">{q.quarter}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Revenue</td>
                    {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.incomeStatement?.revenue} qoq={q.incomeStatement?.revenueQoQ} />)}
                  </tr>
                  <tr>
                    <td className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Operating EBIT</td>
                    {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.incomeStatement?.ebit} qoq={q.incomeStatement?.ebitQoQ} />)}
                  </tr>
                  <tr>
                    <td className="px-8 py-4 text-[10px] font-bold text-slate-900 uppercase">Net Income (PAT)</td>
                    {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.incomeStatement?.pat} qoq={q.incomeStatement?.patQoQ} />)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quarterly Balance Sheet & Cash Flow Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-8 py-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quarterly Balance Sheet Snippet</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Total Assets</td>
                      {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.balanceSheet?.totalAssets} qoq={q.balanceSheet?.assetsQoQ} />)}
                    </tr>
                    <tr>
                      <td className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Total Equity</td>
                      {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.balanceSheet?.totalEquity} qoq={q.balanceSheet?.equityQoQ} />)}
                    </tr>
                    <tr>
                      <td className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Net Debt</td>
                      {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.balanceSheet?.netDebt} qoq={q.balanceSheet?.debtQoQ} />)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-8 py-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quarterly Cash Flow Trends</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Operating CF</td>
                      {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.cashFlow?.operatingCF} qoq={q.cashFlow?.operatingQoQ} />)}
                    </tr>
                    <tr>
                      <td className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Investing CF</td>
                      {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.cashFlow?.investingCF} qoq={q.cashFlow?.investingQoQ} />)}
                    </tr>
                    <tr>
                      <td className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase">Financing CF</td>
                      {data?.quarterly6Q?.map((q, i) => <QuarterlyCell key={i} value={q.cashFlow?.financingCF} qoq={q.cashFlow?.financingQoQ} />)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Footer */}
      <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] opacity-80">
        Data Synthesized via Official Regulatory Filings • Audited Logic Engine • MMXXV
      </div>

      {/* Regulatory Disclaimer Section (Inside Deep Financials) */}
      <div className="py-12 text-center border-t border-slate-200 mt-8">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Compliance & Legal Disclosure</p>
          <p className="text-[10px] text-slate-500 leading-relaxed italic font-medium px-4">
            "All investments in the securities market are subject to market risks. The content provided is for informational and educational purposes only and should not be construed as investment advice. Investors are advised to read all related documents carefully and consult their own independent financial adviser before making any investment decisions. The company/platform assumes no liability for any losses incurred. Past performance is not indicative of future results."
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeepFinancialsView;
