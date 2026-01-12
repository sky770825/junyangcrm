
import React, { useState, useEffect } from 'react';
import { Contact, Deal, ViewType, Interaction } from '../types';
import { getClosingTactics } from '../services/geminiService';
import { TAIWAN_DATA } from '../constants';

interface ContactDetailsProps {
  contact: Contact;
  allContacts: Contact[];
  deals: Deal[];
  onClose: () => void;
  onUpdate: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
  setActiveView: (view: ViewType) => void;
  setMatcherInitialContact: (contact: Contact | null) => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ 
  contact, 
  onClose, 
  onUpdate,
  onDelete,
  setActiveView,
  setMatcherInitialContact 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Contact>({ ...contact });
  const [aiAnalysis, setAiAnalysis] = useState<{persona: string, resistance: string, tactics: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [newInteraction, setNewInteraction] = useState({ type: '備註' as Interaction['type'], content: '', date: new Date().toISOString().split('T')[0] });
  
  const isSeller = editForm.role === 'seller';

  // 解析地區
  const [city, setCity] = useState(editForm.preferredArea?.substring(0, 3) || '台北市');
  const [district, setDistrict] = useState(editForm.preferredArea?.substring(3) || '');

  useEffect(() => {
    setEditForm({ ...contact });
    setCity(contact.preferredArea?.substring(0, 3) || '台北市');
    setDistrict(contact.preferredArea?.substring(3) || '');
    setAiAnalysis(null);
  }, [contact]);

  const handleAiTactics = async () => {
    setIsAnalyzing(true);
    try {
      const res = await getClosingTactics(contact);
      setAiAnalysis(res);
    } catch (err) {
      console.error("AI 攻略生成失敗:", err);
      alert("AI 分析暫時無法連線，請稍後再試。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    const updatedContact = {
      ...editForm,
      preferredArea: `${city}${district}`
    };
    onUpdate(updatedContact);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`確定要刪除客戶「${contact.name}」嗎？此操作無法復原。`)) {
      if (onDelete) {
        onDelete(contact.id);
      }
      onClose();
    }
  };

  const handleAddInteraction = () => {
    if (!newInteraction.content.trim()) {
      alert('請輸入互動內容');
      return;
    }
    const updatedContact = {
      ...editForm,
      interactions: [
        { id: `int-${Date.now()}`, ...newInteraction },
        ...editForm.interactions
      ],
      lastContacted: newInteraction.date
    };
    setEditForm(updatedContact);
    onUpdate(updatedContact);
    setNewInteraction({ type: '備註', content: '', date: new Date().toISOString().split('T')[0] });
    setShowAddInteraction(false);
  };

  const handleFooterAction = () => {
    if (isSeller) {
      setActiveView('marketing-studio');
    } else {
      setMatcherInitialContact(contact);
      setActiveView('property-matcher');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex justify-end z-[100]">
      <div className="w-full max-w-5xl bg-slate-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[64px] overflow-hidden">
        
        {/* Header */}
        <header className="px-12 py-8 bg-white flex justify-between items-center border-b border-slate-100 shadow-sm sticky top-0 z-10">
          <div className="flex items-center space-x-6">
            <div className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center text-2xl font-black ${isSeller ? 'bg-indigo-600 shadow-indigo-200' : 'bg-blue-600 shadow-blue-200'} shadow-lg`}>
              {editForm.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                 {isEditing ? (
                   <input className="text-2xl font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-xl outline-none border border-slate-200 focus:border-blue-500" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                 ) : (
                   <h3 className="text-3xl font-black text-slate-800 tracking-tight">{editForm.name}</h3>
                 )}
                 <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isSeller ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                   {isSeller ? '屋主/案源' : '買方客戶'}
                 </span>
              </div>
              <p className="text-xs font-bold text-slate-400 mt-1">{editForm.phone} • 建檔日：{editForm.lastContacted}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button onClick={handleAiTactics} disabled={isAnalyzing || isEditing} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg hover:scale-105 transition-all disabled:opacity-30">
                {isAnalyzing ? '分析中...' : '✨ 生成 AI 成交攻略'}
             </button>
             <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`px-8 py-3 rounded-2xl font-black text-xs transition-all shadow-lg ${isEditing ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'}`}>
                {isEditing ? '儲存變更' : '編輯資料'}
             </button>
             {onDelete && (
               <button onClick={handleDelete} disabled={isEditing} className="px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-30">
                  刪除客戶
               </button>
             )}
             <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 text-xl font-black hover:bg-slate-200 transition-colors">&times;</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 pb-32">
           
           {/* AI 成交攻略區塊 */}
           {aiAnalysis && !isEditing && (
             <section className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">性格畫像</p>
                      <p className="text-xl font-black">{aiAnalysis.persona}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">核心抗拒點</p>
                      <p className="text-xl font-black">{aiAnalysis.resistance}</p>
                   </div>
                   <div className="md:col-span-3 pt-6 border-t border-white/10">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">建議攻防戰術</p>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed italic">「{aiAnalysis.tactics}」</p>
                   </div>
                </div>
             </section>
           )}

           {/* 第一區塊：核心條件 (預算、地區、電話) */}
           <section className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center space-x-2 border-b pb-4">
                 <span className="text-xl">💰</span>
                 <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">核心交易條件</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">預算/售價 (萬)</label>
                    {isEditing ? (
                      <input type="number" className="text-2xl font-black text-blue-600 bg-slate-50 w-full rounded-2xl p-4 outline-none border-2 border-transparent focus:border-blue-500" value={editForm.budget} onChange={e => setEditForm({...editForm, budget: Number(e.target.value)})} />
                    ) : (
                      <p className="text-2xl font-black text-slate-800">{editForm.budget?.toLocaleString()} 萬</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目標區域 (縣市/行政區)</label>
                    {isEditing ? (
                       <div className="grid grid-cols-2 gap-2">
                          <select className="bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={city} onChange={e => { setCity(e.target.value); setDistrict(TAIWAN_DATA[e.target.value][0]); }}>
                             {Object.keys(TAIWAN_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <select className="bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={district} onChange={e => setDistrict(e.target.value)}>
                             {TAIWAN_DATA[city].map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                       </div>
                    ) : (
                      <p className="text-xl font-black text-slate-800">{editForm.preferredArea}</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">聯絡電話</label>
                    {isEditing ? (
                      /* Fixed: setForm changed to setEditForm */
                      <input className="text-lg font-black text-slate-700 bg-slate-50 w-full rounded-2xl p-4 outline-none" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                    ) : (
                      <p className="text-xl font-bold text-slate-800">{editForm.phone}</p>
                    )}
                 </div>
              </div>
           </section>

           {/* 第二區塊：空間規格需求 (AI 配案核心) */}
           <section className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center space-x-2 border-b pb-4">
                 <span className="text-xl">🏠</span>
                 <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">空間與規格需求 (AI 精準匹配關鍵)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase">房數需求</p>
                    {isEditing ? (
                       <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={editForm.rooms} onChange={e => setEditForm({...editForm, rooms: e.target.value})}>
                          {['1房', '2房', '3房', '4房', '5房+'].map(r => <option key={r} value={r}>{r}</option>)}
                       </select>
                    ) : (
                       <p className="text-lg font-black text-slate-800">{editForm.rooms || '--'}</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase">建物坪數 (坪)</p>
                    {isEditing ? (
                       <input type="number" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={editForm.totalSize || 0} onChange={e => setEditForm({...editForm, totalSize: Number(e.target.value)})} />
                    ) : (
                       <p className="text-lg font-black text-slate-800">{editForm.totalSize ? `${editForm.totalSize} 坪` : '--'}</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase">車位需求</p>
                    {isEditing ? (
                       <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={editForm.parkingPref} onChange={e => setEditForm({...editForm, parkingPref: e.target.value as any})}>
                          {['不需要', '坡平', '機械', '不限'].map(p => <option key={p} value={p}>{p}</option>)}
                       </select>
                    ) : (
                       <p className="text-lg font-black text-blue-600">{editForm.parkingPref || '尚未註記'}</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase">樓層偏好</p>
                    {isEditing ? (
                       <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={editForm.floorPref} onChange={e => setEditForm({...editForm, floorPref: e.target.value as any})}>
                          {['高樓層', '中樓層', '低樓層', '不限'].map(f => <option key={f} value={f}>{f}</option>)}
                       </select>
                    ) : (
                       <p className="text-lg font-black text-slate-800">{editForm.floorPref || '不限'}</p>
                    )}
                 </div>

                 {/* 更多 AI 細節欄位 */}
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase">屋齡限制</p>
                    {isEditing ? (
                       <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={editForm.agePref} onChange={e => setEditForm({...editForm, agePref: e.target.value as any})}>
                          {['5年內', '10年內', '20年內', '30年內', '不限'].map(a => <option key={a} value={a}>{a}</option>)}
                       </select>
                    ) : (
                       <p className="text-lg font-black text-slate-800">{editForm.agePref || '不限'}</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase">方位偏好</p>
                    {isEditing ? (
                       <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={editForm.orientation} onChange={e => setEditForm({...editForm, orientation: e.target.value as any})}>
                          {['座北朝南', '座南朝北', '座西朝東', '座東朝西', '不限'].map(o => <option key={o} value={o}>{o}</option>)}
                       </select>
                    ) : (
                       <p className="text-lg font-black text-slate-800">{editForm.orientation || '不限'}</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase">捷運距離偏好</p>
                    {isEditing ? (
                       <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={editForm.mrtDistance} onChange={e => setEditForm({...editForm, mrtDistance: e.target.value as any})}>
                          {['500m內', '1km內', '不限'].map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    ) : (
                       <p className="text-lg font-black text-emerald-600">{editForm.mrtDistance || '不限'}</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-black uppercase">陽台需求</p>
                    {isEditing ? (
                       <select className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" value={editForm.balconyPref} onChange={e => setEditForm({...editForm, balconyPref: e.target.value as any})}>
                          {['必須有陽台', '不限'].map(b => <option key={b} value={b}>{b}</option>)}
                       </select>
                    ) : (
                       <p className="text-lg font-black text-slate-800">{editForm.balconyPref || '不限'}</p>
                    )}
                 </div>
              </div>
           </section>

           {/* 第三區塊：開發與備註 (文字描述) */}
           <section className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center space-x-2 border-b pb-4">
                 <span className="text-xl">📝</span>
                 <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">開發詳情與備註 (AI 情緒分析重點)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">核心需求描述 / 抗拒點</label>
                    {isEditing ? (
                      <textarea className="w-full bg-slate-50 p-6 rounded-3xl font-bold text-sm min-h-[120px] outline-none border-2 border-transparent focus:border-blue-500" value={editForm.requirement} onChange={e => setEditForm({...editForm, requirement: e.target.value})} placeholder="例如：在意風水、預算極限、需與長輩同住..." />
                    ) : (
                      <p className="text-sm font-bold text-slate-600 leading-relaxed italic">「{editForm.requirement}」</p>
                    )}
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">屋況現況 (僅屋主/案源)</label>
                    {isEditing ? (
                      <textarea className="w-full bg-slate-50 p-6 rounded-3xl font-bold text-sm min-h-[120px] outline-none border-2 border-transparent focus:border-indigo-500" value={editForm.propertyCondition || ''} onChange={e => setEditForm({...editForm, propertyCondition: e.target.value})} placeholder="例如：漏水修繕中、空屋隨時可看、目前出租中..." />
                    ) : (
                      <p className="text-sm font-bold text-slate-600 leading-relaxed italic">{editForm.propertyCondition || '尚未註記屋況細節。'}</p>
                    )}
                 </div>
              </div>
           </section>

           {/* 第四區塊：互動紀錄 */}
           {!isEditing && (
             <section className="space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最近互動歷程</h4>
                   <button 
                     onClick={() => setShowAddInteraction(!showAddInteraction)}
                     className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black hover:bg-blue-700 transition-colors"
                   >
                     {showAddInteraction ? '取消' : '+ 新增互動'}
                   </button>
                </div>
                
                {/* 新增互動表單 */}
                {showAddInteraction && (
                  <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">互動類型</label>
                           <select 
                              className="w-full bg-white p-3 rounded-xl font-bold text-sm outline-none"
                              value={newInteraction.type}
                              onChange={e => setNewInteraction({...newInteraction, type: e.target.value as Interaction['type']})}
                           >
                              <option value="電話">電話</option>
                              <option value="LINE">LINE</option>
                              <option value="面談">面談</option>
                              <option value="帶看">帶看</option>
                              <option value="備註">備註</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">日期</label>
                           <input 
                              type="date"
                              className="w-full bg-white p-3 rounded-xl font-bold text-sm outline-none"
                              value={newInteraction.date}
                              onChange={e => setNewInteraction({...newInteraction, date: e.target.value})}
                           />
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">互動內容</label>
                        <textarea 
                           className="w-full bg-white p-4 rounded-xl font-bold text-sm min-h-[80px] outline-none"
                           value={newInteraction.content}
                           onChange={e => setNewInteraction({...newInteraction, content: e.target.value})}
                           placeholder="輸入互動內容..."
                        />
                     </div>
                     <div className="flex justify-end space-x-3">
                        <button 
                           onClick={() => {
                              setShowAddInteraction(false);
                              setNewInteraction({ type: '備註', content: '', date: new Date().toISOString().split('T')[0] });
                           }}
                           className="px-6 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-300"
                        >
                           取消
                        </button>
                        <button 
                           onClick={handleAddInteraction}
                           className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700"
                        >
                           儲存
                        </button>
                     </div>
                  </div>
                )}
                
                <div className="space-y-4">
                   {editForm.interactions.length > 0 ? editForm.interactions.map((int, i) => (
                      <div key={int.id || i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start space-x-6">
                         <div className="bg-slate-50 p-3 rounded-2xl text-xl shadow-sm">{int.type === '電話' ? '📞' : int.type === '面談' ? '🤝' : int.type === '帶看' ? '🏠' : '💬'}</div>
                         <div className="flex-1">
                            <p className="text-xs font-black text-slate-400">{int.date} • {int.type}</p>
                            <p className="text-sm font-bold text-slate-700 mt-1">{int.content}</p>
                         </div>
                      </div>
                   )) : (
                     <div className="text-center py-10 opacity-20 italic font-bold">暫無互動紀錄</div>
                   )}
                </div>
             </section>
           )}
        </div>

        {/* Footer Actions */}
        <footer className="p-10 border-t border-slate-100 bg-white flex space-x-4 sticky bottom-0 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <button 
            disabled={isEditing}
            onClick={handleFooterAction}
            className={`flex-1 text-white py-6 rounded-[32px] font-black shadow-2xl text-xl transition-all active:scale-95 disabled:opacity-20 ${isSeller ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            {isSeller ? '🚀 生成物件推廣文案' : '🎯 執行智慧配案'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ContactDetails;
