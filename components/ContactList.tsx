
import React, { useState, useMemo } from 'react';
import { Contact } from '../types';
import { TAIWAN_DATA } from '../constants';

interface ContactListProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
  onAddClick: () => void;
}

interface FilterState {
  search: string;
  role: 'all' | 'buyer' | 'seller';
  minBudget: number;
  maxBudget: number;
  city: string;
  district: string;
  agePref: string;
  floorPref: string;
  propertyStatus: string;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onSelect, onAddClick }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: 'all',
    minBudget: 0,
    maxBudget: 20000,
    city: '',
    district: '',
    agePref: '不限',
    floorPref: '不限',
    propertyStatus: '不限'
  });

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchSearch = !filters.search || 
        c.name.includes(filters.search) || 
        c.phone.includes(filters.search) ||
        (c.requirement && c.requirement.includes(filters.search));
      
      const matchRole = filters.role === 'all' || c.role === filters.role;
      const matchBudget = (c.budget || 0) >= filters.minBudget && (c.budget || 0) <= filters.maxBudget;
      const matchCity = !filters.city || (c.preferredArea && c.preferredArea.includes(filters.city));
      const matchDistrict = !filters.district || (c.preferredArea && c.preferredArea.includes(filters.district));
      const matchAge = filters.agePref === '不限' || (c.agePref === filters.agePref);
      const matchFloor = filters.floorPref === '不限' || (c.floorPref === filters.floorPref);
      const matchStatus = filters.propertyStatus === '不限' || (c.propertyStatus === filters.propertyStatus);

      return matchSearch && matchRole && matchBudget && matchCity && matchDistrict && matchAge && matchFloor && matchStatus;
    });
  }, [contacts, filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      minBudget: 0,
      maxBudget: 20000,
      city: '',
      district: '',
      agePref: '不限',
      floorPref: '不限',
      propertyStatus: '不限'
    });
  };

  return (
    <div className="space-y-6">
      {/* 頂部搜尋與控制列 */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="搜尋姓名、電話、或是物件關鍵字..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm transition-all"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-black text-xs transition-all ${showFilters ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'}`}
          >
            <span>{showFilters ? '收起篩選' : '進階篩選'}</span>
            <span>{showFilters ? '🔼' : '🔽'}</span>
          </button>
          <button 
            onClick={onAddClick}
            className="flex-1 sm:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black shadow-xl shadow-slate-200 transition-all"
          >
            + 錄入新客戶
          </button>
        </div>
      </div>

      {/* 進階篩選面板 */}
      {showFilters && (
        <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-xl animate-in slide-in-from-top-4 duration-500 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* 預算範圍篩選 - 修改為雙向輸入 */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">預算區間 (萬)</label>
                <span className="text-[10px] font-black text-blue-600">{filters.minBudget.toLocaleString()} - {filters.maxBudget.toLocaleString()} 萬</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 mr-2">MIN</span>
                  <input 
                    type="number" 
                    className="bg-transparent w-full outline-none font-bold text-xs" 
                    value={filters.minBudget} 
                    onChange={e => setFilters({...filters, minBudget: Math.max(0, Number(e.target.value))})} 
                  />
                </div>
                <div className="text-slate-300 font-bold">~</div>
                <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 mr-2">MAX</span>
                  <input 
                    type="number" 
                    className="bg-transparent w-full outline-none font-bold text-xs" 
                    value={filters.maxBudget} 
                    onChange={e => setFilters({...filters, maxBudget: Math.max(filters.minBudget, Number(e.target.value))})} 
                  />
                </div>
              </div>
              <input 
                type="range" min="0" max="30000" step="100" 
                className="w-full accent-blue-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                value={filters.maxBudget}
                onChange={e => setFilters({...filters, maxBudget: Number(e.target.value)})}
              />
            </div>

            {/* 客戶身分 */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">客戶角色</label>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                {['all', 'buyer', 'seller'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilters({ ...filters, role: r as any })}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black transition-all ${filters.role === r ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {r === 'all' ? '全部' : r === 'buyer' ? '買方' : '屋主'}
                  </button>
                ))}
              </div>
            </div>

            {/* 區域選擇 */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目標區域</label>
              <div className="grid grid-cols-2 gap-2">
                <select 
                  className="bg-slate-50 p-3 rounded-xl text-[10px] font-bold outline-none border border-transparent focus:border-blue-100"
                  value={filters.city}
                  onChange={e => setFilters({...filters, city: e.target.value, district: ''})}
                >
                  <option value="">所有縣市</option>
                  {Object.keys(TAIWAN_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select 
                  className="bg-slate-50 p-3 rounded-xl text-[10px] font-bold outline-none border border-transparent focus:border-blue-100"
                  disabled={!filters.city}
                  value={filters.district}
                  onChange={e => setFilters({...filters, district: e.target.value})}
                >
                  <option value="">所有行政區</option>
                  {filters.city && TAIWAN_DATA[filters.city].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-6 border-t border-slate-50">
            {/* 樓層偏好 */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">樓層偏好</label>
              <div className="flex flex-wrap gap-2">
                {['不限', '低樓層', '中樓層', '高樓層'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilters({...filters, floorPref: f})}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${filters.floorPref === f ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* 屋齡偏好 */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">屋齡限制</label>
              <select 
                className="w-full bg-slate-50 p-3 rounded-xl text-[10px] font-bold outline-none border border-transparent focus:border-blue-100"
                value={filters.agePref}
                onChange={e => setFilters({...filters, agePref: e.target.value})}
              >
                {['不限', '5年內', '10年內', '20年內', '30年內'].map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* 物件狀況 */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">屋況/現況</label>
              <div className="flex flex-wrap gap-2">
                {['不限', '空屋', '出租中', '自住'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setFilters({...filters, propertyStatus: s})}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${filters.propertyStatus === s ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-end space-x-4">
              <button onClick={resetFilters} className="px-6 py-3 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">重置</button>
              <div className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black">符合：{filteredContacts.length} 筆</div>
            </div>
          </div>
        </div>
      )}

      {/* 資料列表表格 */}
      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">身分與資訊</th>
                <th className="px-8 py-6">區域/地址</th>
                <th className="px-8 py-6">狀態</th>
                <th className="px-8 py-6 text-blue-600 font-black">預算/開價</th>
                <th className="px-8 py-6">規格細節</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                  onClick={() => onSelect(contact)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-colors ${
                        contact.role === 'seller' ? 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white'
                      }`}>
                        {contact.role === 'seller' ? '屋' : '買'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 flex items-center space-x-2">
                          <span>{contact.name}</span>
                          {contact.urgency?.includes('S') && <span className="bg-rose-100 text-rose-600 text-[8px] font-black px-1.5 py-0.5 rounded animate-pulse">極急</span>}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1 max-w-[200px] font-medium">{contact.requirement}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-semibold text-slate-600">{contact.preferredArea}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      contact.status.includes('已結案') ? 'bg-emerald-50 text-emerald-600' :
                      contact.status.includes('委託') ? 'bg-indigo-50 text-indigo-600' :
                      contact.status.includes('潛在') ? 'bg-blue-50 text-blue-600' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-base font-extrabold text-slate-900">{contact.budget?.toLocaleString()} <span className="text-[10px] font-black text-slate-400">萬</span></span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                        {contact.rooms || '--'} / {contact.totalSize ? `${contact.totalSize}坪` : '--'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        {contact.floorPref || contact.agePref || '--'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-300 hover:text-blue-600 font-bold text-lg">⋮</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center space-y-4 opacity-20">
                      <span className="text-6xl">🕵️‍♂️</span>
                      <p className="text-slate-900 font-black uppercase text-sm">找不到符合條件的客戶</p>
                      <button onClick={resetFilters} className="text-blue-600 underline text-xs font-bold">重置所有篩選</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
