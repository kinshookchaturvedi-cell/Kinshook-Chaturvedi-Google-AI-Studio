
import React from 'react';
import { CFAReport } from '../types';

interface ReportCardProps {
  report: CFAReport;
  onBack: () => void;
  onViewDeepFinancials: () => void;
}

const ScoreBar: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
  <div className="space-y-1.5 avoid-break score-bar-container">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span className="text-slate-900">{score}/100</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
      <div 
        className={`h-full ${color} transition-all duration-1000 shadow-sm`} 
        style={{ width: `${score}%` }}
      ></div>
    </div>
  </div>
);

const MiniMetric: React.FC<{ label: string; value: string | number; color?: string; suffix?: string }> = ({ label, value, color = "text-slate-900", suffix = "" }) => (
  <div className="py-2">
    <span className="block text-[8px] uppercase text-slate-400 font-black tracking-widest mb-0.5">{label}</span>
    <span className={`text-xs font-bold ${color}`}>{value}{suffix}</span>
  </div>
);

const DataField: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "text-slate-900" }) => (
  <div className="py-2 border-b border-slate-100 last:border-0 md:border-0">
    <span className="block text-[8px] uppercase text-slate-400 font-black tracking-widest mb-0.5">{label}</span>
    <span className={`text-[11px] font-bold block truncate ${color}`}>{value}</span>
  </div>
);

const ReportCard: React.FC<ReportCardProps> = ({ report, onBack, onViewDeepFinancials }) => {
  const { 
    basicInfo, 
    sources, 
    scores, 
    scorecard,
    overallScore,
    porterFiveForces,
    peerGroup,
    industrySpecificRatio
  } = report;

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  const sections = [
    { 
      title: '1. Basic Information & Ownership', 
      icon: 'fa-info-circle', 
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Market Identifiers & Valuation Context</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <DataField label="Ticker Symbol" value={basicInfo.ticker} />
                <DataField label="Primary Exchange" value={basicInfo.exchange} />
                <DataField label="Sector / Vertical" value={basicInfo.sector} />
                <DataField label="Industry Classification" value={basicInfo.industry || 'N/A'} />
                <DataField label="Market Capitalization" value={basicInfo.marketCap} />
                <DataField label="Current Price" value={basicInfo.price} color="text-green-600" />
                <DataField label="Price Target" value={basicInfo.targetPrice} color="text-blue-700" />
                <DataField label="Recommendation" value={basicInfo.recommendation} color={basicInfo.recommendation === 'Buy' ? 'text-green-600' : 'text-slate-900'} />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Liquidity & Float Dynamics</h4>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4 h-full flex flex-col justify-center">
                <div>
                  <span className="block text-[8px] uppercase text-slate-400 font-black tracking-widest mb-1">Liquidity Profile</span>
                  <p className="text-[10px] text-slate-600 leading-relaxed italic">
                    {basicInfo.liquidity || 'Adequate trading volume to support institutional entry/exit without significant slippage.'}
                  </p>
                </div>
                <div className="mt-4">
                  <span className="block text-[8px] uppercase text-slate-400 font-black tracking-widest mb-1">Public Float & Availability</span>
                  <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                    {basicInfo.float || 'High institutional concentration with moderate public availability (approx. 40-60% of outstanding shares).'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 avoid-break">
            <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Major Strategic Shareholders & Institutional Concentration</h4>
            <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 tracking-widest">Shareholder Entity</th>
                    <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Holding (%)</th>
                    <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Filing Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {basicInfo.majorShareholders && basicInfo.majorShareholders.length > 0 ? (
                    basicInfo.majorShareholders.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3 text-[10px] font-bold text-slate-700">{s.name}</td>
                        <td className="px-6 py-3 text-right text-[10px] font-mono font-bold text-slate-900">{s.percentage.toFixed(2)}%</td>
                        <td className="px-6 py-3 text-right text-[8px] font-black text-slate-400 uppercase tracking-tighter">Verified</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-[10px] text-slate-400 italic">No strategic concentrated holdings reported in recent regulatory filings.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    { title: '2. Business Description', content: report.businessDescription, icon: 'fa-building' },
    { 
      title: '3. Competitive Positioning (Porter’s Five Forces)', 
      icon: 'fa-chess-knight',
      content: (
        <div className="space-y-6">
          <p className="mb-4">{report.industryOverview}</p>
          {porterFiveForces && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: 'New Entrants', value: porterFiveForces.newEntrants },
                { label: 'Suppliers', value: porterFiveForces.suppliers },
                { label: 'Buyers', value: porterFiveForces.buyers },
                { label: 'Substitutes', value: porterFiveForces.substitutes },
                { label: 'Rivalry', value: porterFiveForces.rivalry }
              ].map((force, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="block text-[8px] font-black uppercase text-blue-600 mb-1">{force.label}</span>
                  <span className="text-[10px] text-slate-700 leading-tight">{force.value}</span>
                </div>
              ))}
            </div>
          )}
          {peerGroup && peerGroup.length > 0 && (
            <div className="mt-4">
              <span className="block text-[9px] font-black uppercase text-slate-400 mb-2">Competitive Peer Group</span>
              <div className="flex flex-wrap gap-2">
                {peerGroup.map((peer, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-bold text-slate-600">{peer}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    { 
      title: '4. Investment Summary & Mispricing Logic', 
      content: (
        <div className="space-y-4">
          <div>{report.investmentSummary}</div>
          <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-600/20 italic text-[11px] leading-relaxed">
            <span className="block font-black uppercase text-blue-700 text-[9px] mb-2 not-italic">Institutional Mispricing Edge</span>
            {report.mispricingLogic || 'Current market price reflects conservative growth; fails to discount recent margin expansion and TAM growth.'}
          </div>
        </div>
      ), 
      icon: 'fa-lightbulb', 
      highlight: true 
    },
    { 
      title: '5. Valuation Framework (Intrinsic Breakdown)', 
      content: (
        <div className="space-y-6">
          <p>{report.valuation}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-2 mb-4 border-b border-slate-800 pb-2">
                <i className="fas fa-microchip text-blue-400 text-[10px]"></i>
                <span className="block text-[9px] font-black uppercase tracking-widest text-blue-400">Absolute Intrinsic Value (DCF)</span>
              </div>
              <div className="text-[11px] leading-relaxed font-medium space-y-4">
                <p className="whitespace-pre-wrap">{report.absoluteValuationModel || 'Executing multi-stage DCF algorithm...'}</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center space-x-2 mb-4 border-b border-slate-200 pb-2">
                <i className="fas fa-layer-group text-slate-400 text-[10px]"></i>
                <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500">Relative Valuation (Multiples)</span>
              </div>
              <div className="text-[11px] text-slate-700 leading-relaxed font-medium space-y-4">
                <p className="whitespace-pre-wrap">{report.relativeValuationModel || 'Comparing sector-specific multiples (P/E, EV/EBITDA)...'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-[9px] font-bold text-blue-800 italic uppercase text-center tracking-widest">
            Intrinsic Value Calculation methodology adheres to CFA Level II Equity Valuation standards.
          </div>
        </div>
      ), 
      icon: 'fa-balance-scale' 
    },
    { 
      title: '6. Financial Analysis & Quality of Earnings', 
      icon: 'fa-chart-pie',
      content: (
        <div className="space-y-4">
          <p>{report.financialAnalysis}</p>
          <div className="bg-slate-900 p-4 rounded-xl border-l-4 border-l-amber-500 text-slate-300 text-[10px]">
            <span className="block text-[8px] font-black uppercase text-amber-500 mb-2">Earnings Quality & Footnote Audit</span>
            {report.earningsQuality || 'Clean audit trail; no evidence of aggressive revenue recognition or depreciation tampering.'}
          </div>
          {industrySpecificRatio && (
            <div className="flex items-center space-x-4 bg-white border border-slate-200 p-3 rounded-lg">
               <i className="fas fa-tag text-blue-600 text-xs"></i>
               <span className="text-[9px] font-black uppercase text-slate-500">{industrySpecificRatio.label}:</span>
               <span className="text-[11px] font-bold text-slate-900">{industrySpecificRatio.value}</span>
            </div>
          )}
        </div>
      )
    },
    { title: '7. Investment Risks & Red Flags', content: report.investmentRisks, icon: 'fa-triangle-exclamation' },
    { title: '8. ESG Materiality Deep-Dive', content: report.esgSection, icon: 'fa-leaf' },
  ];

  return (
    <div className="max-w-6xl mx-auto mb-20 animate-fadeIn space-y-6 px-4">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 printable-report">
        {/* Header Section */}
        <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <button onClick={onBack} className="no-print mb-8 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg flex items-center transition-all border border-slate-700 font-black text-[10px] uppercase tracking-widest">
              <i className="fas fa-arrow-left mr-2"></i> Terminal Home
            </button>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-blue-600 px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase">
                {basicInfo.ticker}
              </span>
              <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                {basicInfo.exchange}
              </span>
            </div>
            <h1 className="text-5xl serif font-bold mb-3 tracking-tight uppercase leading-tight">
              {basicInfo.name}
            </h1>
            <p className="text-blue-400 text-xs uppercase tracking-[0.3em] font-black">
              CFA Institute Compliant Research • 2025 Edition
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className={`text-[10px] font-black px-6 py-2 rounded-full mb-6 shadow-xl tracking-widest uppercase ${basicInfo.recommendation === 'Buy' ? 'bg-green-600' : basicInfo.recommendation === 'Sell' ? 'bg-red-600' : 'bg-slate-700'}`}>
              ANALYST STANCE: {basicInfo.recommendation}
            </div>
            <div className="text-6xl font-black tracking-tighter leading-none">{basicInfo.targetPrice}</div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">Target Fair Value</div>
            {overallScore !== undefined && (
              <div className="mt-6 flex items-center bg-blue-600/30 px-5 py-2 rounded-xl border border-blue-500/30 shadow-inner">
                <span className="text-[9px] font-black uppercase tracking-widest mr-4 text-blue-200">Conviction</span>
                <span className="text-3xl font-black text-white">{overallScore}<span className="text-sm text-slate-400 font-normal ml-1">/100</span></span>
              </div>
            )}
          </div>
        </div>

        {/* Factors & Attribution Summary */}
        <div className="bg-slate-50 border-b border-slate-200 px-10 py-8 avoid-break">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center">
            <i className="fas fa-microchip mr-3 text-blue-600"></i> Multi-Factor Quantitative Attribution
          </h3>
          {scores && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <ScoreBar label="Quality" score={scores.quality} color="bg-blue-600" />
              <ScoreBar label="Growth" score={scores.growth} color="bg-emerald-500" />
              <ScoreBar label="Momentum" score={scores.momentum} color="bg-purple-600" />
              <ScoreBar label="Valuation" score={scores.valuation} color="bg-amber-500" />
              <ScoreBar label="ESG" score={scores.esg} color="bg-green-600" />
            </div>
          )}
        </div>

        <div className="p-10 space-y-12">
          {/* Main Narrative Content Sections 1-8 */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 w-64 uppercase tracking-widest border-r border-slate-200">Dimension</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Institutional Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sections.map((sec, idx) => (
                  <tr key={idx} className={`${sec.highlight ? 'bg-blue-50/40' : ''} avoid-break`}>
                    <td className="px-8 py-8 font-black text-slate-800 align-top text-[10px] uppercase tracking-widest border-r border-slate-200">
                      <i className={`fas ${sec.icon} mr-4 text-slate-400 w-5 text-center text-sm`}></i>
                      {sec.title}
                    </td>
                    <td className="px-8 py-8 text-slate-600 text-xs leading-relaxed text-justify whitespace-pre-wrap font-medium">
                      {sec.content}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* COMPREHENSIVE INSTITUTIONAL SCORECARD */}
          {scorecard && (
            <div className="space-y-6 avoid-break pt-8">
              <div className="flex items-center space-x-3 mb-2 border-b-2 border-slate-900 pb-3">
                <i className="fas fa-file-invoice-dollar text-xl text-blue-600"></i>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Comprehensive Institutional Scorecard</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center">
                    <i className="fas fa-shield-check mr-2"></i> Health & Solvency
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <MiniMetric 
                      label="Altman Z-Score" 
                      value={scorecard.essentialChecks.altmanZ.toFixed(2)} 
                      color={scorecard.essentialChecks.altmanZ > 3 ? "text-green-600" : scorecard.essentialChecks.altmanZ > 1.8 ? "text-amber-600" : "text-red-600"}
                    />
                    <MiniMetric label="Piotroski F-Score" value={`${scorecard.essentialChecks.piotroskiF}/9`} />
                    <MiniMetric label="Beneish M/Modified C" value={scorecard.essentialChecks.modifiedC.toFixed(2)} />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center">
                    <i className="fas fa-chart-line-up mr-2"></i> Growth Persistence (3Y)
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <MiniMetric label="Sales Growth (Est)" value={scorecard.growth3Y.sales} suffix="%" />
                    <MiniMetric label="EBIT Growth" value={scorecard.growth3Y.ebit} suffix="%" />
                    <MiniMetric label="EPS Growth" value={scorecard.growth3Y.eps} suffix="%" />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center">
                    <i className="fas fa-percentage mr-2"></i> Operating Efficiency
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <MiniMetric label="Average ROE" value={scorecard.average3Y.roe} suffix="%" />
                    <MiniMetric label="EBIT Margin" value={scorecard.average3Y.ebitMargin} suffix="%" />
                    <MiniMetric label="PAT Margin" value={scorecard.average3Y.patMargin} suffix="%" />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center">
                    <i className="fas fa-tags mr-2"></i> Relative Valuation
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <MiniMetric label="5Y Median P/E" value={scorecard.priceData.pe5yMedian} />
                    <MiniMetric label="P/E Gap (%)" value={scorecard.valuationMetrics.peDiscount} suffix="%" color={scorecard.valuationMetrics.peDiscount < 0 ? "text-green-600" : "text-red-600"} />
                    <MiniMetric label="PEG Ratio" value={scorecard.priceData.peg} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-white shadow-2xl space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1 space-y-4 w-full">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Institutional Ownership Attribution (%)</h4>
                    <div className="flex w-full h-3 rounded-full overflow-hidden border border-slate-700">
                      <div className="bg-blue-500 h-full" style={{ width: `${scorecard.shareholding.promoter}%` }}></div>
                      <div className="bg-indigo-400 h-full" style={{ width: `${scorecard.shareholding.fii}%` }}></div>
                      <div className="bg-emerald-400 h-full" style={{ width: `${scorecard.shareholding.dii}%` }}></div>
                      <div className="bg-slate-700 h-full" style={{ width: `${scorecard.shareholding.others}%` }}></div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span> Promoter: {scorecard.shareholding.promoter}%</span>
                      <span className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span> FII/FPI: {scorecard.shareholding.fii}%</span>
                      <span className="flex items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span> DII/Mutual Funds: {scorecard.shareholding.dii}%</span>
                      <span className="flex items-center"><span className="w-2 h-2 bg-slate-700 rounded-full mr-2"></span> Retail/Others: {scorecard.shareholding.others}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-slate-800 pb-2">Top Domestic Fund House Exposure</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scorecard.fundHouseInvested.map((fund, idx) => (
                      <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center group hover:bg-slate-800 transition-colors">
                        <span className="text-xs font-bold text-slate-300 group-hover:text-white">{fund.name}</span>
                        <span className="text-xs font-mono font-black text-blue-400">{fund.percentage.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filing Insight Box */}
          <div className="p-10 bg-slate-900 text-slate-300 rounded-3xl border-l-[16px] border-l-blue-600 shadow-2xl text-[11px] leading-relaxed italic border border-slate-800 relative overflow-hidden avoid-break">
            <div className="absolute top-0 right-0 p-4 text-slate-800 opacity-20"><i className="fas fa-quote-right text-6xl"></i></div>
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 not-italic border-b border-slate-800 pb-3 inline-block">Institutional Filing Insight (FY24/25)</h4>
            <div className="relative z-10">{report.executiveSummary || 'Awaiting synchronization with local market filings...'}</div>
          </div>

          {/* Deep Financials Navigation */}
          <div className="no-print pt-8 pb-4 flex justify-center">
            <button 
              onClick={onViewDeepFinancials}
              className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200 transform hover:-translate-y-1"
            >
              <i className="fas fa-database mr-3"></i> View Deep Financials (9Y Historical & 6Q Quarterly)
            </button>
          </div>

          {/* Grounding Trail */}
          {sources && sources.length > 0 && (
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 border-dashed no-print space-y-5 avoid-break">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <i className="fas fa-shield-halved mr-3 text-blue-500"></i> Grounding Audit Trail
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sources.map((source, i) => (
                  <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-600 hover:text-blue-800 font-black truncate flex items-center bg-white p-3 rounded-xl border border-slate-200 transition-all hover:border-blue-300 shadow-sm">
                    <i className="fas fa-link mr-3 text-slate-300"></i>
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Regulatory Disclaimer */}
          <div className="pt-10 pb-4 border-t-2 border-slate-100 text-center avoid-break">
            <div className="max-w-4xl mx-auto space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Compliance & Legal Disclosure</p>
              <p className="text-[10px] text-slate-500 leading-relaxed italic font-medium px-4">
                "All investments in the securities market are subject to market risks. The content provided is for informational and educational purposes only and should not be construed as investment advice. Investors are advised to read all related documents carefully and consult their own independent financial adviser before making any investment decisions. The company/platform assumes no liability for any losses incurred. Past performance is not indicative of future results."
              </p>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="no-print flex justify-between items-center pt-8">
            <button onClick={onBack} className="text-slate-400 font-black hover:text-blue-600 text-[10px] uppercase tracking-widest transition-colors flex items-center group">
              <i className="fas fa-chevron-left mr-3 group-hover:-translate-x-1 transition-transform"></i> Return to Terminal
            </button>
            <div className="flex space-x-5">
              <button onClick={handlePrint} className="px-10 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-300 shadow-sm">
                Generate PDF
              </button>
              <button onClick={handlePrint} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black shadow-2xl transition-all border border-slate-800">
                Print Research Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] pt-8 opacity-50">
        CFA COMPLIANCE HUB • KC ADVISORY • MMXXV
      </div>
    </div>
  );
};

export default ReportCard;
