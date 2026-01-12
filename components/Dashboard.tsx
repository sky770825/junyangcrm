
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Contact, Deal, ViewType } from '../types';

interface DashboardProps {
  contacts: Contact[];
  deals: Deal[];
  setActiveView: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, deals, setActiveView }) => {
  const totalBudget = contacts.filter(c => c.role === 'buyer').reduce((sum, c) => sum + c.budget, 0);
  const closedDeals = deals.filter(d => d.stage === '結案' || d.stage === '成交簽約');
  const actualRevenue = closedDeals.reduce((sum, d) => sum + d.value, 0);
  const monthlyGoal = 5000;
  const goalProgress = Math.min(Math.round((actualRevenue / monthlyGoal) * 100), 100);

  // 補強：過期未追蹤客戶
  const urgentContacts = contacts.filter(c => {
    if (c.status === '議價中') return true;
    const lastDate = new Date(c.lastContacted);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    return diffDays > 7;
  }).slice(0, 3);

  const activeBuyers = contacts.filter(c => c.role === 'buyer' && c.status === '潛在買方').length;
  const activeSellers = contacts.filter(c => c.role === 'seller' && c.status === '委託中').length;

  const chartData = [
    { name: '7月', value: 12000 },
    { name: '8月', value: 15400 },
    { name: '9月', value: 9800 },
    { name: '10月', value: 18900 },
    { name: '11月', value: 24500 },
    { name: '12月', value: actualRevenue || 31000 },
  ];

  const sourceData = Array.from(new Set(contacts.map(c => c.source))).map(source => ({
    name: source,
    value: contacts.filter(c => c.source === source).length
  }));

  const COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
               <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Monthly Target</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">目標：{monthlyGoal.toLocaleString()} 萬</span>
               </div>
               <h2 className="text-5xl font-black mb-4">業績達成率 <span className="text-blue-500">{goalProgress}%</span></h2>
               <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-1000" style={{ width: `${goalProgress}%` }}></div>
               </div>
               <p className="text-slate-400 text-sm font-medium">目前已入帳：<span className="text-white font-bold">{actualRevenue.toLocaleString()} 萬</span></p>
            </div>
            
            {/* 今日急件區塊 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-md">
               <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center space-x-2">
                 <span>🚨</span>
                 <span>今日急需追蹤 ({urgentContacts.length})</span>
               </h4>
               <div className="space-y-3">
                  {urgentContacts.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                       <div>
                          <p className="text-xs font-bold">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.status} • {c.lastContacted} 至今未聯絡</p>
                       </div>
                       <button className="text-[10px] font-black bg-blue-600 px-3 py-1.5 rounded-xl">撥打</button>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-10">業績趨勢分析</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-8">客戶來源占比</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                    {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
