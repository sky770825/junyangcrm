
import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onAddClick: () => void;
  pendingLeadsCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, onAddClick, pendingLeadsCount }) => {
  const navItems = [
    { id: 'dashboard' as ViewType, label: '儀表板', icon: '📊' },
    { id: 'contacts' as ViewType, label: '客戶管理', icon: '👥' },
    { id: 'property-matcher' as ViewType, label: '智慧配案', icon: '🤝' },
    { id: 'marketing-studio' as ViewType, label: '行銷研究室', icon: '🎨' },
    { id: 'lead-inbox' as ViewType, label: '進件收件匣', icon: '📥', count: pendingLeadsCount },
    { id: 'agent-tools' as ViewType, label: '房仲工具箱', icon: '🧰' },
    { id: 'short-video' as ViewType, label: '短影音腳本', icon: '🎬' },
    { id: 'ai-insights' as ViewType, label: 'AI 銷售策略', icon: '✨' },
  ];

  const quickLinks = [
    { label: '樂居 LEJU', url: 'https://www.leju.com.tw', icon: '🏘️', color: 'bg-orange-500' },
    { label: '591 房屋交易', url: 'https://www.591.com.tw', icon: '🏠', color: 'bg-yellow-500' },
    { label: '實價登錄 2.0', url: 'https://lvr.land.moi.gov.tw', icon: '📈', color: 'bg-blue-500' },
    { label: '地籍便民系統', url: 'https://easymap.land.moi.gov.tw', icon: '🗺️', color: 'bg-emerald-500' },
    { label: '即夢 AI (專業繪圖)', url: 'https://jimeng.jianying.com/ai-tool/home/', icon: '🎨', color: 'bg-purple-600' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-6">
          <h1 className="text-2xl font-black bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent italic">
            吉房 AI CRM
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.3em] font-black">Intelligence Pro</p>
        </div>
        
        <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto scrollbar-hide">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 px-4">主要功能</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                activeView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-xs">{item.label}</span>
              </div>
              {item.count ? (
                <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}

          <div className="mt-8 space-y-2 pb-8">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 px-4">外部工具快捷</p>
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all group"
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] ${link.color} text-white group-hover:scale-110 transition-transform shadow-sm`}>
                  {link.icon}
                </span>
                <span className="font-bold text-[11px]">{link.label}</span>
                <span className="text-[8px] opacity-0 group-hover:opacity-100 ml-auto transition-opacity">↗</span>
              </a>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center font-black text-white text-xs">王</div>
            <div className="flex flex-col">
              <p className="text-xs font-black">王牌經紀人</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">系統已就緒</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {navItems.find(n => n.id === activeView)?.label}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="flex space-x-2 mr-4 border-r border-slate-100 pr-4">
                {quickLinks.slice(0, 4).map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
                    <span className="text-sm">{link.icon}</span>
                  </a>
                ))}
             </div>
             <button onClick={onAddClick} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-black transition-all shadow-lg">
               + 快速錄入
             </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
