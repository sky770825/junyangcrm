
import React from 'react';
import { Deal, Contact } from '../types';

interface DealKanbanProps {
  deals: Deal[];
  contacts: Contact[];
  onUpdateDeal: (deal: Deal) => void;
}

const STAGES = ['初次洽談', '現場帶看', '要約議價', '成交簽約', '結案'] as const;

const DealKanban: React.FC<DealKanbanProps> = ({ deals, contacts, onUpdateDeal }) => {
  const getContact = (id: string) => contacts.find(c => c.id === id);

  const moveDeal = (deal: Deal, direction: 'prev' | 'next') => {
    const currentIndex = STAGES.indexOf(deal.stage as any);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < STAGES.length) {
      onUpdateDeal({ ...deal, stage: STAGES[nextIndex] as any });
    }
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-10 scrollbar-hide">
      {STAGES.map((stage) => {
        const stageDeals = deals.filter(d => d.stage === stage);
        const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div key={stage} className="flex-shrink-0 w-80 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-black text-slate-800 text-sm tracking-tight">{stage}</h4>
                <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-full">{stageDeals.length}</span>
              </div>
              <p className="text-[10px] font-black text-blue-600">${stageTotal.toLocaleString()} 萬</p>
            </div>
            
            <div className="bg-slate-50/50 rounded-[32px] p-3 min-h-[500px] border border-slate-100/50 space-y-4">
              {stageDeals.map((deal) => {
                const contact = getContact(deal.contactId);
                return (
                  <div key={deal.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">預估結案：{deal.expectedClose}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {deal.probability}%
                      </div>
                    </div>
                    <h5 className="font-bold text-slate-800 mb-1">{deal.title}</h5>
                    <p className="text-[10px] text-slate-400 font-bold mb-4">客戶：{contact?.name || '未知'}</p>
                    
                    <div className="flex items-center justify-between">
                       <p className="text-lg font-black text-slate-900">${deal.value.toLocaleString()}<span className="text-[10px] ml-1">萬</span></p>
                       <div className="flex space-x-1">
                          {STAGES.indexOf(stage) > 0 && (
                            <button onClick={() => moveDeal(deal, 'prev')} className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 flex items-center justify-center">←</button>
                          )}
                          {STAGES.indexOf(stage) < STAGES.length - 1 && (
                            <button onClick={() => moveDeal(deal, 'next')} className="w-8 h-8 rounded-xl bg-slate-900 text-white hover:bg-black flex items-center justify-center">→</button>
                          )}
                       </div>
                    </div>
                  </div>
                );
              })}
              {stageDeals.length === 0 && (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <span className="text-[10px] font-black text-slate-300 uppercase">暫無案件</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealKanban;
