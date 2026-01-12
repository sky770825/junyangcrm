
import React, { useState, useEffect } from 'react';
import { ViewType, Contact, Deal, IncomingLead } from './types';
import { INITIAL_CONTACTS, INITIAL_DEALS, TAIWAN_DATA, SOURCE_OPTIONS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import AIStrategy from './components/AIStrategy';
import ContactDetails from './components/ContactDetails';
import LeadInbox from './components/LeadInbox';
import AgentTools from './components/AgentTools';
import ShortVideoScript from './components/ShortVideoScript';
import DealKanban from './components/DealKanban';
import AIPropertyMatcher from './components/AIPropertyMatcher';
import MarketingStudio from './components/MarketingStudio';
import { parseRawLead } from './services/geminiService';

const STORAGE_KEY_CONTACTS = 'gf_crm_contacts_v8';
const STORAGE_KEY_DEALS = 'gf_crm_deals_v8';
const STORAGE_KEY_LEADS = 'gf_crm_leads_v8';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONTACTS);
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });
  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DEALS);
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });
  const [incomingLeads, setIncomingLeads] = useState<IncomingLead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LEADS);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [matcherInitialContact, setMatcherInitialContact] = useState<Contact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [parsing, setParsing] = useState(false);
  const [magicText, setMagicText] = useState('');

  const [form, setForm] = useState({
    name: '', phone: '', role: 'buyer' as 'buyer' | 'seller', budget: 2000,
    city: '台北市', district: '大安區', propertyType: '電梯大樓', rooms: '3房',
    hasParking: '坡平', urgency: 'B (一般)' as any, source: '591',
    requirement: '', purpose: '自住' as any, features: [] as string[],
    downPayment: 400, agePref: '10年內' as any, floorPref: '不限' as any,
    orientation: '不限' as any, balconyPref: '不限' as any,
    entrustType: '尚未委託' as any, keyStatus: '屋主開門' as any, totalSize: 0, buildingAge: 0, 
    addressDetail: '', targetCommunity: '', 
    contactPerson: '', ownerName: '', ownerPhone: '', mrtStation: '', nearbySchool: '', propertyCondition: ''
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts));
    localStorage.setItem(STORAGE_KEY_DEALS, JSON.stringify(deals));
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(incomingLeads));
  }, [contacts, deals, incomingLeads]);

  const handleMagicFill = async () => {
    if (!magicText.trim()) return;
    setParsing(true);
    const parsed = await parseRawLead(magicText);
    if (parsed) {
      setForm(prev => ({
        ...prev,
        name: parsed.name || prev.name,
        phone: parsed.phone || prev.phone,
        role: parsed.role || prev.role,
        budget: parsed.budget || prev.budget,
        preferredArea: parsed.preferredArea || prev.preferredArea,
        purpose: (parsed as any).purpose || prev.purpose,
        urgency: (parsed as any).urgency || prev.urgency,
      }));
      setMagicText('');
    }
    setParsing(false);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      id: Date.now().toString(),
      ...form,
      preferredArea: `${form.city}${form.district}`,
      email: '',
      status: form.role === 'seller' ? '開發中 (屋主)' : '潛在買方',
      lastContacted: new Date().toISOString().split('T')[0],
      tags: ['手動錄入', form.urgency, ...form.features],
      interactions: [{ id: `int-${Date.now()}`, type: '備註', content: '新客戶建檔完成。', date: new Date().toISOString().split('T')[0] }]
    };
    setContacts([newContact, ...contacts]);
    setShowAddContact(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: '', phone: '', role: 'buyer', budget: 2000, city: '台北市', district: '大安區',
      propertyType: '電梯大樓', rooms: '3房', hasParking: '坡平', urgency: 'B (一般)',
      source: '591', requirement: '', purpose: '自住', features: [], downPayment: 400,
      agePref: '10年內', floorPref: '不限', orientation: '不限', balconyPref: '不限',
      entrustType: '尚未委託', keyStatus: '屋主開門', totalSize: 0, buildingAge: 0,
      addressDetail: '', targetCommunity: '',
      contactPerson: '', ownerName: '', ownerPhone: '', mrtStation: '', nearbySchool: '', propertyCondition: ''
    });
    setWizardStep(1);
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} onAddClick={() => setShowAddContact(true)} pendingLeadsCount={incomingLeads.length}>
      {activeView === 'dashboard' && <Dashboard contacts={contacts} deals={deals} setActiveView={setActiveView} />}
      {activeView === 'contacts' && <ContactList contacts={contacts} onSelect={setSelectedContact} onAddClick={() => setShowAddContact(true)} />}
      {activeView === 'property-matcher' && <AIPropertyMatcher contacts={contacts} initialBuyer={matcherInitialContact} />}
      {activeView === 'marketing-studio' && <MarketingStudio />}
      {activeView === 'lead-inbox' && <LeadInbox leads={incomingLeads} onAccept={l => setContacts([{id: Date.now().toString(), ...l, email: '', requirement: l.rawContent, status: '潛在買方', lastContacted: new Date().toISOString().split('T')[0], tags: [], interactions: []} as any, ...contacts])} onReject={id => setIncomingLeads(prev => prev.filter(l => l.id !== id))} onAddLeads={newLeads => setIncomingLeads([...newLeads, ...incomingLeads])} />}
      {activeView === 'short-video' && <ShortVideoScript />}
      {activeView === 'agent-tools' && <AgentTools />}
      {activeView === 'deals' && <DealKanban deals={deals} contacts={contacts} onUpdateDeal={d => setDeals(prev => prev.map(old => old.id === d.id ? d : old))} />}
      {activeView === 'ai-insights' && <AIStrategy contacts={contacts} deals={deals} />}
      
      {selectedContact && (
        <ContactDetails 
          contact={selectedContact} 
          allContacts={contacts} 
          deals={deals} 
          onClose={() => setSelectedContact(null)} 
          onUpdate={u => setContacts(prev => prev.map(c => c.id === u.id ? u : c))}
          onDelete={(id) => {
            if (window.confirm('確定要刪除這個客戶嗎？此操作無法復原。')) {
              setContacts(prev => prev.filter(c => c.id !== id));
              setSelectedContact(null);
            }
          }}
          setActiveView={setActiveView}
          setMatcherInitialContact={setMatcherInitialContact}
        />
      )}

      {showAddContact && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4 overflow-hidden">
          <div className="bg-white w-full max-w-6xl rounded-[56px] shadow-2xl flex flex-col h-[90vh] animate-in zoom-in-95 duration-500">
             
             <header className="px-12 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <div>
                   <h3 className="text-3xl font-black text-slate-800 tracking-tight">智慧客戶錄入</h3>
                   <div className="flex items-center space-x-2 mt-2">
                      {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${wizardStep >= s ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                      ))}
                      <span className="text-[10px] font-black text-slate-400 uppercase ml-4">Step {wizardStep} of 4</span>
                   </div>
                </div>
                <button onClick={() => setShowAddContact(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-full text-slate-300 text-2xl font-black hover:text-slate-900">&times;</button>
             </header>

             <div className="flex-1 overflow-y-auto p-12 space-y-12">
                
                {wizardStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
                    <section className="bg-blue-50/50 p-8 rounded-[40px] border border-blue-100 space-y-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">👤</span>
                        <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest">核心身分資訊</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">客戶姓名</label>
                            <input className="w-full bg-white p-6 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="例如：林先生" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">聯絡電話</label>
                            <input className="w-full bg-white p-6 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-xl" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="09xx-xxx-xxx" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">客戶角色</label>
                            <div className="flex bg-white p-1 rounded-2xl shadow-sm">
                               {['buyer', 'seller'].map(r => (
                                 <button key={r} onClick={() => setForm({...form, role: r as any})} className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${form.role === r ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
                                    {r === 'buyer' ? '🎯 買方客戶' : '🏠 屋主/案源'}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">實際聯絡人 (若不同)</label>
                            <input className="w-full bg-white p-6 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-xl" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} placeholder="如：林太太、秘書" />
                         </div>
                      </div>
                    </section>
                  </div>
                )}

                {wizardStep === 2 && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
                      <section className="bg-slate-50 p-8 rounded-[40px] space-y-8">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                               <span className="text-xl">📍</span>
                               <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">區域與地段環境</h4>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目標區域</label>
                               <div className="grid grid-cols-2 gap-4">
                                  <select className="bg-white p-6 rounded-2xl font-black" value={form.city} onChange={e => setForm({...form, city: e.target.value, district: TAIWAN_DATA[e.target.value][0]})}>
                                     {Object.keys(TAIWAN_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                                  <select className="bg-white p-6 rounded-2xl font-black" value={form.district} onChange={e => setForm({...form, district: e.target.value})}>
                                     {TAIWAN_DATA[form.city].map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">鄰近捷運站</label>
                               <input className="w-full bg-white p-6 rounded-2xl border-none outline-none font-bold" value={form.mrtStation} onChange={e => setForm({...form, mrtStation: e.target.value})} placeholder="如：台北101站、大安站" />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">明星學區需求</label>
                               <input className="w-full bg-white p-6 rounded-2xl border-none outline-none font-bold" value={form.nearbySchool} onChange={e => setForm({...form, nearbySchool: e.target.value})} placeholder="如：建國中學、師大附中" />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">物件類型</label>
                               <select className="w-full bg-white p-6 rounded-2xl font-black" value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})}>
                                  {['電梯大樓', '透天別墅', '公寓', '華廈', '店面', '土地'].map(t => <option key={t} value={t}>{t}</option>)}
                               </select>
                            </div>
                         </div>
                      </section>
                   </div>
                )}

                {wizardStep === 3 && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
                      <section className="bg-emerald-50/50 p-8 rounded-[40px] border border-emerald-100 space-y-8">
                         <div className="flex items-center space-x-2">
                            <span className="text-xl">💰</span>
                            <h4 className="font-black text-emerald-900 uppercase text-xs tracking-widest">財務與動機</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{form.role === 'buyer' ? '購屋總預算 (萬)' : '期望售價 (萬)'}</label>
                               <input type="number" className="w-full bg-white p-6 rounded-2xl font-black text-3xl text-emerald-600 outline-none" value={form.budget} onChange={e => setForm({...form, budget: Number(e.target.value)})} />
                            </div>
                            {form.role === 'buyer' && (
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">自備款預算 (萬)</label>
                                  <input type="number" className="w-full bg-white p-6 rounded-2xl font-black text-3xl text-blue-600 outline-none" value={form.downPayment} onChange={e => setForm({...form, downPayment: Number(e.target.value)})} />
                               </div>
                            )}
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">開發來源</label>
                               <select className="w-full bg-white p-6 rounded-2xl font-black" value={form.source} onChange={e => setForm({...form, source: e.target.value})}>
                                  {SOURCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                               </select>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">急迫度</label>
                               <select className="w-full bg-white p-6 rounded-2xl font-black" value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value as any})}>
                                  {['S (極急)', 'A (積極)', 'B (一般)', 'C (觀察)'].map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                            </div>
                         </div>
                      </section>
                   </div>
                )}

                {wizardStep === 4 && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
                      {form.role === 'buyer' ? (
                        <section className="bg-white p-8 rounded-[40px] border border-slate-100 space-y-8">
                           <div className="flex items-center space-x-2 border-b pb-4">
                              <span className="text-xl">✨</span>
                              <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">買方深度需求</h4>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">房數偏好</label>
                                 <div className="flex bg-slate-50 p-1 rounded-2xl">
                                    {['1房', '2房', '3房', '4房+'].map(r => (
                                      <button key={r} onClick={() => setForm({...form, rooms: r})} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${form.rooms === r ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>
                                         {r}
                                      </button>
                                    ))}
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">車位偏好</label>
                                 <select className="w-full bg-slate-50 p-6 rounded-2xl font-black" value={form.hasParking} onChange={e => setForm({...form, hasParking: e.target.value})}>
                                    {['坡平', '機械', '不限', '不需要'].map(p => <option key={p} value={p}>{p}</option>)}
                                 </select>
                              </div>
                           </div>
                        </section>
                      ) : (
                        <section className="bg-indigo-50/50 p-8 rounded-[40px] border border-indigo-100 space-y-8">
                           <div className="flex items-center space-x-2 border-b border-indigo-100 pb-4">
                              <span className="text-xl">🏛️</span>
                              <h4 className="font-black text-indigo-900 uppercase text-xs tracking-widest">屋主/物件詳情</h4>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">完整地址 (含門牌樓層)</label>
                                 <input className="w-full bg-white p-6 rounded-2xl font-black outline-none" value={form.addressDetail} onChange={e => setForm({...form, addressDetail: e.target.value})} placeholder="xx路xx號xx樓" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">委託類型</label>
                                 <select className="w-full bg-white p-6 rounded-2xl font-black" value={form.entrustType} onChange={e => setForm({...form, entrustType: e.target.value as any})}>
                                    {['專任委託', '一般委託', '尚未委託'].map(t => <option key={t} value={t}>{t}</option>)}
                                 </select>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">屋況簡述 (漏水、修繕現況)</label>
                                 <input className="w-full bg-white p-6 rounded-2xl font-bold outline-none" value={form.propertyCondition} onChange={e => setForm({...form, propertyCondition: e.target.value})} placeholder="如：現況漏水、剛翻新過" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">屋主姓名 (若與客戶名不同)</label>
                                 <input className="w-full bg-white p-6 rounded-2xl font-bold outline-none" value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} placeholder="登記名義人" />
                              </div>
                           </div>
                        </section>
                      )}
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">重要備註 / 核心抗拒點</label>
                         <textarea className="w-full bg-slate-50 p-8 rounded-[32px] font-bold text-lg min-h-[150px] outline-none border-2 border-transparent focus:border-blue-600 transition-all" value={form.requirement} onChange={e => setForm({...form, requirement: e.target.value})} placeholder="例如：個性急躁、在意風水、預算有彈性..." />
                      </div>
                   </div>
                )}
             </div>

             <footer className="px-12 py-8 bg-white border-t border-slate-100 flex justify-between items-center">
                <button onClick={() => setWizardStep(prev => Math.max(prev-1, 1))} disabled={wizardStep === 1} className={`px-10 py-5 rounded-[24px] font-black text-sm transition-all ${wizardStep === 1 ? 'opacity-0' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>← 上一步</button>
                {wizardStep < 4 ? (
                  <button onClick={() => setWizardStep(prev => Math.min(prev+1, 4))} className="px-12 py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all">下一步</button>
                ) : (
                  <button onClick={handleManualAdd} className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm shadow-2xl shadow-slate-200 hover:bg-black transition-all">🚀 完成錄入</button>
                )}
             </footer>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
