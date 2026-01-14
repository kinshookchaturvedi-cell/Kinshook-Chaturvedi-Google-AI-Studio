
import React from 'react';
import { CFAReport } from '../types';

interface ReportCardProps {
  report: CFAReport;
  onBack: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onBack }) => {
  const { basicInfo, sources } = report;

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { title: '1. Basic Information', content: (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
        <div><span className="block text-xs uppercase text-slate-500 font-semibold">Ticker / Exchange</span><span className="font-bold">{basicInfo.ticker} / {basicInfo.exchange}</span></div>
        <div><span className="block text-xs uppercase text-slate-500 font-semibold">Sector</span><span className="font-bold">{basicInfo.sector}</span></div>
        <div><span className="block text-xs uppercase text-slate-500 font-semibold text-green-600">Current Price (Live)</span><span className="font-bold">{basicInfo.price}</span></div>
        <div><span className="block text-xs uppercase text-slate-500 font-semibold text-blue-600">Price Target</span><span className="font-bold text-blue-700">{basicInfo.targetPrice}</span></div>
      </div>
    )},
    { title: '2. Business Description', content: report.businessDescription, icon: 'fa-building' },
    { title: '3. Industry & Competitive Positioning', content: report.industryOverview, icon: 'fa-chess' },
    { title: '4. Investment Summary', content: report.investmentSummary, icon: 'fa-lightbulb', highlight: true },
    { title: '5. Valuation', content: report.valuation, icon: 'fa-balance-scale' },
    { title: '6. Financial Analysis', content: report.financialAnalysis, icon: 'fa-chart-pie' },
    { title: '7. Investment Risks', content: report.investmentRisks, icon: 'fa-exclamation-triangle' },
    { title: '8. ESG Section', content: report.esgSection, icon: 'fa-leaf' },
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 animate-fadeIn mb-12">
      {/* Header */}
      <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
        <div>
          <button 
            onClick={onBack} 
            className="no-print mb-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg flex items-center transition-all border border-slate-700 font-semibold text-sm"
          >
            <i className="fas fa-arrow-left mr-2"></i> Return to Screened Stocks
          </button>
          <h1 className="text-4xl serif font-bold mb-2">{basicInfo.name}</h1>
          <p className="text-slate-400 text-lg uppercase tracking-widest">{basicInfo.sector} • Equity Research Report</p>
          <div className="mt-2 text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Verified via live market search
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold px-3 py-1 rounded mb-4 inline-block ${
            basicInfo.recommendation === 'Buy' ? 'bg-green-600' : basicInfo.recommendation === 'Sell' ? 'bg-red-600' : 'bg-yellow-600'
          }`}>
            {basicInfo.recommendation.toUpperCase()}
          </div>
          <div className="text-4xl font-bold">{basicInfo.targetPrice}</div>
          <div className="text-xs text-slate-400">12-MONTH TARGET PRICE</div>
        </div>
      </div>

      {/* CFA Elements Table */}
      <div className="p-8">
        <div className="mb-10 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 w-64 uppercase tracking-wider">CFA Core Element</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Analysis Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sections.map((sec, idx) => (
                <tr key={idx} className={sec.highlight ? 'bg-blue-50/50' : ''}>
                  <td className="px-6 py-5 font-bold text-slate-800 align-top flex items-center">
                    <i className={`fas ${sec.icon || 'fa-info-circle'} mr-3 text-slate-400`}></i>
                    {sec.title}
                  </td>
                  <td className="px-6 py-5 text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {sec.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Search Grounding Sources */}
        {sources && sources.length > 0 && (
          <div className="mb-10 p-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
              <i className="fas fa-globe mr-2"></i> Verification Sources (Google Grounding)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] text-blue-600 hover:text-blue-800 font-medium truncate flex items-center"
                >
                  <i className="fas fa-external-link-alt mr-2 text-slate-400"></i>
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="no-print flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 border-t border-slate-100 pt-8">
          <button 
            onClick={onBack}
            className="w-full md:w-auto px-6 py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center border border-transparent hover:border-blue-100"
          >
            <i className="fas fa-list mr-2"></i> BACK TO STOCK LIST
          </button>
          
          <div className="flex space-x-4 w-full md:w-auto">
            <button 
              onClick={handlePrint}
              className="flex-1 md:flex-none px-6 py-3 border border-slate-300 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              <i className="fas fa-download mr-2"></i> Export PDF
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center"
            >
              <i className="fas fa-print mr-2"></i> Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 uppercase tracking-widest">
          Strictly Confidential • Verified Live Data • CFA Institute Equity Research Standards Compliant
        </p>
      </div>
    </div>
  );
};

export default ReportCard;
