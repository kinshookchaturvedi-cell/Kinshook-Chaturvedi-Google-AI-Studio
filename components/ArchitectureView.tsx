
import React from 'react';

const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
          <i className="fas fa-sitemap mr-3 text-blue-600"></i>
          System Architecture
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 border border-slate-100 rounded-lg bg-slate-50">
            <h3 className="font-semibold text-blue-700 mb-2">Frontend Stack</h3>
            <ul className="text-sm space-y-2 text-slate-600">
              <li><span className="font-medium text-slate-800">Framework:</span> React 18 + TypeScript</li>
              <li><span className="font-medium text-slate-800">Styling:</span> Tailwind CSS (Utility-first)</li>
              <li><span className="font-medium text-slate-800">Visuals:</span> Recharts for Financial Data</li>
              <li><span className="font-medium text-slate-800">State:</span> React Hooks & Context</li>
            </ul>
          </div>
          
          <div className="p-5 border border-slate-100 rounded-lg bg-slate-50">
            <h3 className="font-semibold text-blue-700 mb-2">AI Engine</h3>
            <ul className="text-sm space-y-2 text-slate-600">
              <li><span className="font-medium text-slate-800">Model:</span> Gemini 3 Pro / Flash</li>
              <li><span className="font-medium text-slate-800">Logic:</span> Zero-shot screening + CoT</li>
              <li><span className="font-medium text-slate-800">Template:</span> CFA Essentials Mapping</li>
              <li><span className="font-medium text-slate-800">Constraint:</span> Financial Accuracy Filter</li>
            </ul>
          </div>

          <div className="p-5 border border-slate-100 rounded-lg bg-slate-50">
            <h3 className="font-semibold text-blue-700 mb-2">Data & Backend</h3>
            <ul className="text-sm space-y-2 text-slate-600">
              <li><span className="font-medium text-slate-800">Primary API:</span> Google GenAI SDK</li>
              <li><span className="font-medium text-slate-800">Financial Data:</span> Yahoo/Bloomberg (Simulated)</li>
              <li><span className="font-medium text-slate-800">Security:</span> API Key Env management</li>
              <li><span className="font-medium text-slate-800">Latency:</span> Streaming for long reports</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
          <i className="fas fa-calculator mr-3 text-blue-600"></i>
          Proprietary Ranking Logic (The Scoring Algorithm)
        </h2>
        
        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="mb-4">
            Our screening engine uses a Multi-Factor Ranking (MFR) algorithm that weights 
            quantitative metrics against qualitative investment concepts.
          </p>
          
          <div className="bg-slate-900 text-slate-300 p-6 rounded-lg font-mono text-sm mb-6">
            <code>
              Final Score = Σ (Factor_i * Weight_i) + Concept_Alignment_Bonus<br/>
              where Factor_i ∈ {`{ Fundamental_Ratio, Market_Cap, Beta, Yield }`}<br/>
              Weight_i is dynamically adjusted based on the chosen Investment Concept.
            </code>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left">Weight Class</th>
                <th className="px-4 py-3 text-left">Logic</th>
                <th className="px-4 py-3 text-left">Concept Relevance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-800">Quantitative (60%)</td>
                <td className="px-4 py-3">Hard metrics (P/E, ROE, D/E) screened against industry deciles.</td>
                <td className="px-4 py-3">Critical for Deep Value & Growth.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-800">Qualitative (30%)</td>
                <td className="px-4 py-3">AI-driven analysis of management calls and strategic filings.</td>
                <td className="px-4 py-3">Crucial for Value Recovery.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-800">ESG Overlay (10%)</td>
                <td className="px-4 py-3">Risk-adjusted score based on carbon disclosure and board ethics.</td>
                <td className="px-4 py-3">Mandatory for ESG Excellence.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureView;
