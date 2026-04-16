import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, Gauge, Info, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { predictLotto } from './engine/lottoEngine';
import './App.css';
function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [prediction, setPrediction] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [isLuckySpinning, setIsLuckySpinning] = useState(false);
  const [luckyNum, setLuckyNum] = useState('--');

  const dreams = [
    { label: 'งู/สัตว์เลื้อยคลาน', val: '5, 6, 56, 65' },
    { label: 'น้ำ/ปลา/ฝน', val: '8, 2, 82, 28' },
    { label: 'ทอง/เงิน/ของมีค่า', val: '4, 9, 49, 94' },
    { label: 'ศพ/คนตาย', val: '0, 4, 04, 40' },
    { label: 'พระ/สิ่งศักดิ์สิทธิ์', val: '9, 1, 91, 19' }
  ];

  const horoscopes = {
    'วันจันทร์': { luck: 85, desc: 'ปีแห่งข่าวดี! มีเกณฑ์ได้รับโชคลาภจากการเดินทางและติดต่อสื่อสาร', colors: { main: '#FFFFFF', sub: '#60A5FA', avoid: 'สีแดง, ส้ม' } },
    'วันอังคาร': { luck: 90, desc: 'ดวงการงานพุ่งแรง! ผลงานโดดเด่น มีโอกาสได้เลื่อนขั้นเลื่อนตำแหน่งสูงมาก', colors: { main: '#F472B6', sub: '#FDE047', avoid: 'สีน้ำเงิน, ดำ' } },
    'วันพุธ': { luck: 92, desc: 'ปีแห่งความสำเร็จในการเจรจา ค้าขายร่ำรวย ปิดดีลใหญ่ได้ดังใจหวัง', colors: { main: '#22C55E', sub: '#EAB308', avoid: 'สีแดง, ม่วง' } },
    'วันพฤหัสบดี': { luck: 78, desc: 'ปีแห่งการเรียนรู้และการพัฒนาตนเอง สิ่งที่ทุ่มเทศึกษาจะนำพาความสำเร็จมาให้', colors: { main: '#EAB308', sub: '#FB923C', avoid: 'สีดำ, น้ำเงินเข้ม' } },
    'วันศุกร์': { luck: 95, desc: 'ดวงความรักสดใสที่สุด! มีเกณฑ์สละโสดหรือพบเจอคู่แท้ที่เกื้อหนุนกัน', colors: { main: '#F472B6', sub: '#4ADE80', avoid: 'สีเขียวเข้ม, น้ำเงิน' } },
    'วันเสาร์': { luck: 88, desc: 'โชคลาภพุ่งเข้าหา! จะมีโชคจากความฝันที่แม่นยำหรือลางสังหรณ์พิเศษ', colors: { main: '#A855F7', sub: '#FDE047', avoid: 'สีแดงสด, ส้ม' } },
    'วันอาทิตย์': { luck: 80, desc: 'ปีแห่งการเริ่มต้นใหม่ สิ่งที่เคยหยุดชะงักจะกลับมาเดินหน้าก้าวกระโดด', colors: { main: '#EF4444', sub: '#FDE047', avoid: 'สีม่วงเข้ม, น้ำเงิน' } }
  };

  const handleLuckyPick = () => {
    setIsLuckySpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setLuckyNum(Math.floor(Math.random() * 100).toString().padStart(2, '0'));
      count++;
      if (count > 15) {
        clearInterval(interval);
        setIsLuckySpinning(false);
      }
    }, 80);
  };

  useEffect(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    let nextDraw;
    if (day <= 16) {
      nextDraw = new Date(year, month, 16);
    } else {
      nextDraw = new Date(year, month + 1, 1);
    }
    
    const formatted = format(nextDraw, 'yyyy-MM-dd');
    setTargetDate(formatted);
    
    setIsCalculating(true);
    setTimeout(() => {
      setPrediction(predictLotto(formatted, 'Nonthaburi'));
      setIsCalculating(false);
    }, 1200);
  }, []);

  const todayThai = prediction?.analysis?.day || 'วันพฤหัสบดี';

  return (
    <div className="container">
      <div className="top-banner gold-text">
        <Sparkles size={14} /> ใช้ข้อมูลสถิติ 10 ปี + AI คัดเลขมงคลให้คุณ งวดวันที่ {targetDate ? format(new Date(targetDate), 'd MMMM yyyy', { locale: th }) : '...'}
      </div>

      <header className="header animate-fade">
        <div className="logo-section">
          <Sparkles className="logo-icon-main" />
          <h1 className="gold-text">ANTIGRAVITY</h1>
          <p className="subtitle">ใช้ข้อมูลสถิติ 10 ปี + AI คัดเลขมงคลให้คุณ</p>
        </div>
      </header>

      <div className="nav-container">
        <nav className="main-nav">
          <button 
            className={`nav-item ${activeTab === 'lotto' ? 'active' : ''}`}
            onClick={() => setActiveTab('lotto')}
          >
            <TrendingUp size={18} /> ทำนายเลขเด็ด
          </button>
          <div className="nav-divider"></div>
          <button 
            className={`nav-item ${activeTab === 'horoscope' ? 'active' : ''}`}
            onClick={() => setActiveTab('horoscope')}
          >
            <Sparkles size={18} /> ดูดวงรายวัน
          </button>
        </nav>
      </div>

      <main className="main-focused">
        {activeTab === 'lotto' ? (
          <>
            <div className="draw-info glass-card">
              <Calendar className="icon-gold" size={24} />
              <div className="draw-text">
                <h3>งวดประจำวันที่</h3>
                <h2 className="gold-text">
                  {targetDate ? format(new Date(targetDate), 'd MMMM yyyy', { locale: th }) : '...'}
                </h2>
                <p className="location-tag">
                  <MapPin size={14} /> สถานที่ออกรางวัล: {prediction?.analysis?.location || 'กองสลาก'}
                </p>
              </div>
            </div>

            <section className="result-panel">
              <AnimatePresence mode="wait">
                {isCalculating ? (
                  <motion.div key="l" className="loading-state glass-card">
                    <div className="spinner"></div><p>กำลังวิเคราะห์พิกัดเศรษฐี...</p>
                  </motion.div>
                ) : prediction && (
                  <motion.div key="r" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <div className="main-row">
                      <div className="main-number glass-card primary-focus">
                        <span className="label">AI คัดเลขเน้น 1 ตัว (วิ่ง)</span>
                        <div className="digit-big gold-text">{prediction.singleDigit}</div>
                      </div>
                      <div className="doubles-card glass-card">
                        <span className="label">เลขเบิ้ล (ยอดนิยม)</span>
                        <div className="number-list">
                          {prediction.doubles.map(n => <div key={n} className="num-badge double">{n}</div>)}
                        </div>
                      </div>
                    </div>

                    <div className="grid-2 extras-row">
                      <div className="glass-card lucky-pick-card">
                        <span className="label">สุ่มเลขมงคลเฉพาะคุณ</span>
                        <div className={`lucky-display gold-text ${isLuckySpinning ? 'spinning' : ''}`}>{luckyNum}</div>
                        <button className="btn-primary" onClick={handleLuckyPick} disabled={isLuckySpinning}>
                          {isLuckySpinning ? 'กำลังเสี่ยงทาย...' : 'สุ่มเลขดวงวันนี้'}
                        </button>
                      </div>
                      <div className="glass-card dream-card">
                        <span className="label">ทำนายฝันเลขเด็ด</span>
                        <div className="dream-list">
                          {dreams.map(d => (
                            <div key={d.label} className="dream-item">
                              <span className="dream-label">{d.label}</span>
                              <span className="dream-val gold-text">{d.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="sub-numbers">
                      <div className="glass-card result-box">
                        <span className="label">2 ตัวท้าย (สถิติ 10 ปี)</span>
                        <div className="number-list">
                          {prediction.twoDigits.map(n => <span key={n} className="num-badge">{n}</span>)}
                        </div>
                      </div>
                      <div className="glass-card result-box">
                        <span className="label">3 ตัวท้าย (สถิติ 10 ปี)</span>
                        <div className="number-list">
                          {prediction.threeDigits.map(n => <span key={n} className="num-badge gold">{n}</span>)}
                        </div>
                      </div>
                    </div>

                    <div className="stats-row grid-2">
                       <div className="glass-card winrate-card">
                        <span className="label">Winrate ความแม่นยำ</span>
                        <div className="win-value gold-text">{prediction.stats.winrate}%</div>
                      </div>
                      <div className="glass-card past-result-card">
                        <span className="label">ผลรางวัลกองสลากล่าสุด</span>
                        <div className="past-grid">
                          <div className="past-val big">{prediction.stats.pastResult.firstPrize}</div>
                          <div className="past-sub-grid">
                            <div><span className="small-label">2 ตัว</span><div className="past-val gold-text">{prediction.stats.pastResult.twoSuffix}</div></div>
                            <div><span className="small-label">3 ตัว</span><div className="past-val">{prediction.stats.pastResult.threeSuffix}</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </>
        ) : (
          <motion.section 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="horoscope-view"
          >
            <div className="glass-card horoscope-header">
              <h2 className="gold-text">ดูดวง & สีมงคล ประจำ{todayThai}</h2>
              <p>เช็คพลังดวงชะตาและสีเสริมบารมีก่อนเสี่ยงโชค</p>
            </div>

            <div className="horoscope-grid">
              {Object.entries(horoscopes).map(([day, data]) => (
                <div key={day} className={`glass-card birthday-item ${day === todayThai ? 'active-today' : ''}`}>
                  <div className="day-header">
                    <span className="day-name">{day}</span>
                    <span className="luck-percent">โชคลาภ {data.luck}%</span>
                  </div>
                  <div className="luck-bar"><div className="luck-fill" style={{ width: `${data.luck}%` }}></div></div>
                  <p className="luck-desc">{data.desc}</p>
                  <div className="color-section">
                    <span className="label">สีมงคล:</span>
                    <div className="color-chips">
                      <div className="color-chip" title="งาน/เงิน" style={{ backgroundColor: data.colors.main }}></div>
                      <div className="color-chip" title="ความรัก" style={{ backgroundColor: data.colors.sub }}></div>
                    </div>
                    <p className="avoid-text">เลี่ยง: {data.colors.avoid}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card color-table-card">
              <span className="label">ตารางสีมงคลพรีเมียม (เรียกทรัพย์)</span>
              <table className="color-table">
                <thead><tr><th>โชคดีเรื่อง</th><th>สีที่แนะนำ</th></tr></thead>
                <tbody>
                  <tr><td>การเงิน/ลาภลอย</td><td className="gold-text">เขียวเหนี่ยวทรัพย์, ทอง, ส้ม</td></tr>
                  <tr><td>อำนาจบารมี</td><td>ชมพู, แดงเข้ม</td></tr>
                  <tr><td>เมตตามหานิยม</td><td>ฟ้าใส, ขาวมุก</td></tr>
                  <tr><td>สีกาลกิณี (ควรเลี่ยง)</td><td className="text-danger">ดำ, เทาแก่</td></tr>
                </tbody>
              </table>
            </div>
          </motion.section>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Antigravity AI Lotto Engine - เพื่อความบันเทิงและเพื่อลุ้นสร้างอนาคต</p>
      </footer>
    </div>
  );
}

export default App;
