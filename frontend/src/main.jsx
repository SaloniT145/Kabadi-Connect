import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, BadgeCheck, Camera, ChevronRight, CircleDollarSign, MapPin, PackageCheck, Recycle, ShieldCheck, Sparkles, TrendingUp, Truck, Upload, Users } from 'lucide-react';
import './styles.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [stats, setStats] = useState(null);
  const [prices, setPrices] = useState([]);
  const [recyclers, setRecyclers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [classification, setClassification] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/stats`).then((response) => response.json()),
      fetch(`${API_URL}/prices`).then((response) => response.json()),
      fetch(`${API_URL}/recyclers`).then((response) => response.json()),
      fetch(`${API_URL}/transactions`).then((response) => response.json())
    ]).then(([statsData, pricesData, recyclersData, transactionsData]) => {
      setStats(statsData);
      setPrices(pricesData);
      setRecyclers(recyclersData);
      setTransactions(transactionsData);
    }).catch(() => setStats({ totalEarnings: 0, itemsRecycled: 0, activeCollectors: 0, verifiedRecyclers: 0, monthlyChange: 0 }));
  }, []);

  const classifyItem = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/classify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    setClassification(await response.json());
    setLoading(false);
  };

  const navItems = [
    { label: 'Overview', icon: Activity },
    { label: 'Identify e-waste', icon: Camera },
    { label: 'Find recyclers', icon: MapPin },
    { label: 'Transactions', icon: PackageCheck }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Recycle size={21} /></span><span>Kabadi<span className="brand-accent">Connect</span></span></div>
        <div className="profile-mini"><div className="avatar">RK</div><div><strong>Ramesh Kumar</strong><span>Collector account</span></div><ChevronRight size={16} /></div>
        <nav>{navItems.map(({ label, icon: Icon }) => <button className={activeTab === label ? 'nav-item active' : 'nav-item'} key={label} onClick={() => setActiveTab(label)}><Icon size={18} /><span>{label}</span></button>)}</nav>
        <div className="sidebar-footer"><div className="help-card"><ShieldCheck size={20} /><div><strong>Safety first</strong><span>View handling guidelines</span></div><ChevronRight size={15} /></div><span className="version">MVP dashboard · v0.1</span></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><span className="eyebrow">Tuesday, 08 September 2026</span><h1>{activeTab === 'Overview' ? 'Good morning, Ramesh' : activeTab}</h1></div><div className="top-actions"><button className="language-button">अ हिंदी <ChevronRight size={15} /></button><div className="notification"><span></span> <Activity size={19} /></div><div className="avatar avatar-small">RK</div></div></header>

        {activeTab === 'Overview' && <>
          <section className="hero-panel"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={15} /> Your recycling companion</span><h2>Turn every find into a <em>fair deal.</em></h2><p>Identify materials, discover today's rates, and connect with verified recyclers near you.</p><button className="primary-button" onClick={() => setActiveTab('Identify e-waste')}>Identify e-waste <ArrowUpRight size={17} /></button></div><div className="hero-art"><div className="ring ring-one"></div><div className="ring ring-two"></div><Recycle size={74} strokeWidth={1.1} /></div></section>
          <section className="stat-grid"><StatCard icon={CircleDollarSign} label="Total earnings" value={`₹${(stats?.totalEarnings || 0).toLocaleString('en-IN')}`} detail={`+${stats?.monthlyChange || 0}% this month`} positive /><StatCard icon={PackageCheck} label="Items recycled" value={stats?.itemsRecycled || 0} detail="Across 8 categories" /><StatCard icon={Users} label="Active collectors" value={stats?.activeCollectors || 0} detail="In your network" /><StatCard icon={BadgeCheck} label="Verified recyclers" value={stats?.verifiedRecyclers || 0} detail="Ready to buy" /></section>
          <div className="content-grid"><section className="surface price-surface"><div className="section-heading"><div><span className="section-label">Market pulse</span><h3>Today's material rates</h3></div><button className="text-button" onClick={() => setActiveTab('Transactions')}>View ledger <ArrowUpRight size={15} /></button></div><div className="price-list">{prices.map((price) => <div className="price-row" key={price.category}><div className="material-icon"><Recycle size={17} /></div><div className="material-name"><strong>{price.category}</strong><span>per {price.unit}</span></div><strong className="rate">₹{price.rate}</strong><span className={price.trend.startsWith('+') ? 'trend up' : 'trend down'}><TrendingUp size={13} /> {price.trend}</span></div>)}</div></section><section className="surface recycler-surface"><div className="section-heading"><div><span className="section-label">Trusted network</span><h3>Nearby recyclers</h3></div><button className="icon-button" onClick={() => setActiveTab('Find recyclers')}><ArrowUpRight size={16} /></button></div>{recyclers.slice(0, 3).map((recycler) => <div className="recycler-row" key={recycler.name}><div className="recycler-logo"><Truck size={18} /></div><div><strong>{recycler.name}</strong><span>{recycler.area} · {recycler.distance}</span></div><BadgeCheck size={16} className="verified" /></div>)}</section></div>
        </>}

        {activeTab === 'Identify e-waste' && <IdentifyPanel classification={classification} loading={loading} onClassify={classifyItem} />}
        {activeTab === 'Find recyclers' && <div className="detail-grid"><section className="surface full-surface"><div className="section-heading"><div><span className="section-label">Verified network</span><h3>Find a recycler near you</h3></div><span className="location-pill"><MapPin size={14} /> Mumbai, MH</span></div>{recyclers.map((recycler) => <div className="recycler-detail" key={recycler.name}><div className="recycler-logo large"><Truck size={21} /></div><div className="recycler-detail-copy"><strong>{recycler.name} <BadgeCheck size={15} className="verified" /></strong><span>{recycler.area} · {recycler.distance} away</span><small>Accepts: {recycler.materials}</small></div><button className="outline-button">View details <ChevronRight size={15} /></button></div>)}</section></div>}
        {activeTab === 'Transactions' && <div className="detail-grid"><section className="surface full-surface"><div className="section-heading"><div><span className="section-label">Your activity</span><h3>Transaction ledger</h3></div><span className="earnings-total">₹{(stats?.totalEarnings || 0).toLocaleString('en-IN')} earned</span></div><div className="transaction-table"><div className="table-head"><span>Reference</span><span>Material</span><span>Weight</span><span>Amount</span><span>Date</span></div>{transactions.map((transaction) => <div className="table-row" key={transaction.id}><strong>{transaction.id}</strong><span>{transaction.material}</span><span>{transaction.weight} kg</span><strong>₹{transaction.amount.toLocaleString('en-IN')}</strong><span>{transaction.date}</span></div>)}</div></section></div>}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail, positive }) { return <div className="stat-card"><div className="stat-icon"><Icon size={18} /></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className={positive ? 'stat-detail positive' : 'stat-detail'}>{positive && <TrendingUp size={13} />}{detail}</span></div>; }

function IdentifyPanel({ classification, loading, onClassify }) { return <div className="detail-grid"><section className="surface identify-surface"><div className="section-heading"><div><span className="section-label">Smart identification</span><h3>What did you collect today?</h3></div><span className="ai-badge"><Sparkles size={14} /> AI assisted</span></div><button className="upload-zone" onClick={onClassify}><div className="upload-icon">{loading ? <Activity className="spin" size={25} /> : <Upload size={25} />}</div><strong>{loading ? 'Analysing sample...' : 'Upload a photo to identify'}</strong><span>JPG or PNG · classification takes a moment</span></button>{classification && <div className="classification-result"><div className="result-top"><div><span className="section-label">Likely material</span><h4>{classification.category}</h4></div><span className="confidence">{Math.round(classification.confidence * 100)}% match</span></div><div className="result-price"><span>Estimated market value</span><strong>₹{classification.suggestedPrice}<small> / kg</small></strong></div><p>{classification.note}</p><button className="primary-button">Add to transaction <ArrowUpRight size={16} /></button></div>}</section><section className="surface guide-surface"><span className="section-label">Quick guide</span><h3>Handle with care</h3><p>Separate batteries and broken screens before transport. Keep components dry and avoid direct contact with leaking cells.</p><div className="guide-item"><ShieldCheck size={18} /><span>Wear gloves when sorting</span></div><div className="guide-item"><ShieldCheck size={18} /><span>Keep batteries away from heat</span></div><div className="guide-item"><ShieldCheck size={18} /><span>Use sturdy boxes for glass</span></div></section></div>; }

export default App;
