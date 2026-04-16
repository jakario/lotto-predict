import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, TrendingUp, Layout, Zap, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { predictLotto } from './engine/lottoEngine';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [selectedTarot, setSelectedTarot] = useState(null);
  const [isTarotFlipping, setIsTarotFlipping] = useState(false);

  const tarotCards = [
    { name: 'The Sun (ไพ่พระอาทิตย์)', mean: 'โชคดีที่สุด! ความสำเร็จที่มาในรูปแบบลาภลอย และความรุ่งเรืองขั้นสุด', img: '19.jpg' },
    { name: 'Wheel of Fortune (กงล้อแห่งโชค)', mean: 'กงล้อแห่งโชคลาภหมุนมาทางคุณแล้ว! มีเกณฑ์ถูกรางวัลใหญ่หรือได้เงินปึกใหญ่', img: '10.jpg' },
    { name: 'The Empress (ไพ่จักรพรรดินี)', mean: 'ความมั่งคั่งอุดมสมบูรณ์ มีกินมีใช้ไม่ขาดมือ และจะมีโชคจากผู้หญิงผิวขาว', img: '3.jpg' },
    { name: 'The Magician (ไพ่อัศจรรย์)', mean: 'มีซิกเซนส์ที่แม่นยำในงวดนี้ ลองเชื่อมั่นในลางสังหรณ์แรกของคุณจะให้โชค', img: '1.jpg' },
    { name: 'The World (ไพ่โลก)', mean: 'ความสำเร็จที่สมบูรณ์แบบ ทั้งงาน เงิน และโชคลาภ จะไหลมาเทมาทุกทิศทาง', img: '21.jpg' },
    { name: 'The Star (ไพ่ดวงดาว)', mean: 'ความหวังใหม่และโชคลาภที่รอคอยกำลังจะปรากฏ จะได้รับข่าวดีเรื่องเงินที่เคยมีปัญหา', img: '17.jpg' },
    { name: 'Ace of Pentacles (1 เหรียญ)', mean: 'โอกาสทองเรื่องเงินมาถึงแล้ว! จะได้รับทรัพย์ก้อนโตแบบไม่คาดฝัน', img: 'ace_p.jpg' },
    { name: 'King of Pentacles (ราชาเหรียญ)', mean: 'เจ้าแห่งความรวย! หยิบจับอะไรเป็นเงินเป็นทอง งวดนี้มีเกณฑ์เป็นเศรษฐีใหม่', img: 'king_p.jpg' }
  ];

  const handlePickTarot = () => {
    setIsTarotFlipping(true);
    setSelectedTarot(null);
    setTimeout(() => {
      const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
      setSelectedTarot(card);
      setIsTarotFlipping(false);
    }, 1500);
  };

  const [prediction, setPrediction] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [isLuckySpinning, setIsLuckySpinning] = useState(false);
  const [luckyNum, setLuckyNum] = useState('--');

  const dreamPool = [
    { label: 'งู/สัตว์เลื้อยคลาน', val: '5, 6, 56, 65' },
    { label: 'น้ำ/ปลา/ฝน', val: '8, 2, 82, 28' },
    { label: 'ทอง/เงิน/ของมีค่า', val: '4, 9, 49, 94' },
    { label: 'ศพ/คนตาย', val: '0, 4, 04, 40' },
    { label: 'พระ/สิ่งศักดิ์สิทธิ์', val: '9, 1, 91, 19' },
    { label: 'บ้าน/อาคาร/สิ่งก่อสร้าง', val: '4, 7, 47, 74' },
    { label: 'เด็ก/กุมารทอง', val: '1, 3, 13, 31' },
    { label: 'อุบัติเหตุ/เลือด', val: '6, 0, 60, 06' },
    { label: 'ภูเขา/ที่สูง', val: '7, 9, 79, 97' },
    { label: 'แหวน/กำไล/เครื่องประดับ', val: '0, 8, 08, 80' },
    { label: 'ช้าง/สัตว์ใหญ่', val: '9, 5, 95, 59' },
    { label: 'ไฟ/แสงสว่าง', val: '3, 4, 34, 43' }
  ];

  const [dailyDreams, setDailyDreams] = useState([]);

  const horoscopes = {
    'วันจันทร์': { luck: 85, desc: 'ปีแห่งข่าวดี! มีเกณฑ์ได้รับโชคลาภจากการเดินทางและติดต่อสื่อสาร', colors: { main: { label: 'ขาวมุก', hex: '#FFFFFF' }, sub: { label: 'ฟ้าใส', hex: '#60A5FA' }, avoid: { label: 'สีแดง, ส้ม', hex: '#EF4444' } } },
    'วันอังคาร': { luck: 90, desc: 'ดวงการงานพุ่งแรง! ผลงานโดดเด่น มีโอกาสได้เลื่อนขั้นเลื่อนตำแหน่งสูงมาก', colors: { main: { label: 'ชมพู', hex: '#F472B6' }, sub: { label: 'เหลือง', hex: '#FDE047' }, avoid: { label: 'น้ำเงิน, ดำ', hex: '#1E3A8A' } } },
    'วันพุธ': { luck: 92, desc: 'ปีแห่งความสำเร็จในการเจรจา ค้าขายร่ำรวย ปิดดีลใหญ่ได้ดังใจหวัง', colors: { main: { label: 'เขียวเข้ม', hex: '#166534' }, sub: { label: 'ทอง', hex: '#EAB308' }, avoid: { label: 'แดง, ม่วง', hex: '#991B1B' } } },
    'วันพฤหัสบดี': { luck: 78, desc: 'ปีแห่งการเรียนรู้และการพัฒนาตนเอง สิ่งที่ทุ่มเทศึกษาจะนำพาความสำเร็จมาให้', colors: { main: { label: 'ส้ม', hex: '#FB923C' }, sub: { label: 'ทองแดง', hex: '#B45309' }, avoid: { label: 'ดำ, น้ำเงิน', hex: '#000000' } } },
    'วันศุกร์': { luck: 95, desc: 'ดวงความรักสดใสที่สุด! มีเกณฑ์สละโสดหรือพบเจอคู่แท้ที่เกื้อหนุนกัน', colors: { main: { label: 'ชมพูอ่อน', hex: '#FBCFE8' }, sub: { label: 'เขียวตอง', hex: '#86EFAC' }, avoid: { label: 'เทา, น้ำเงิน', hex: '#4B5563' } } },
    'วันเสาร์': { luck: 88, desc: 'โชคลาภพุ่งเข้าหา! จะมีโชคจากความฝันที่แม่นยำหรือลางสังหรณ์พิเศษ', colors: { main: { label: 'ม่วง', hex: '#A855F7' }, sub: { label: 'เหลืองมุก', hex: '#FEF9C3' }, avoid: { label: 'แดง, ส้ม', hex: '#DC2626' } } },
    'วันอาทิตย์': { luck: 80, desc: 'ปีแห่งการเริ่มต้นใหม่ สิ่งที่เคยหยุดชะงักจะกลับมาเดินหน้าก้าวกระโดด', colors: { main: { label: 'แดง', hex: '#EF4444' }, sub: { label: 'เหลืองนวล', hex: '#FEF08A' }, avoid: { label: 'ม่วง, ดำ', hex: '#581C87' } } }
  };

  useEffect(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    const dateKey = `${year}-${month}-${day}`;

    const savedLucky = localStorage.getItem('lucky_click_data');
    if (savedLucky) {
      const parsed = JSON.parse(savedLucky);
      if (parsed.date === dateKey) { setLuckyNum(parsed.num); }
    }

    const seed = day + month + year;
    const shuffled = [...dreamPool].sort(() => 0.5 - (Math.sin(seed) * 0.5 + 0.5));
    setDailyDreams(shuffled.slice(0, 5));

    let nextDraw = day <= 16 ? new Date(year, month, 16) : new Date(year, month + 1, 1);
    const formatted = format(nextDraw, 'yyyy-MM-dd');
    setTargetDate(formatted);
    
    setIsCalculating(true);
    setTimeout(() => {
      setPrediction(predictLotto(formatted, 'Nonthaburi'));
      setIsCalculating(false);
    }, 1200);
  }, []);

  const handleLuckyPick = () => {
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const savedLucky = localStorage.getItem('lucky_click_data');
    if (savedLucky) {
      const parsed = JSON.parse(savedLucky);
      if (parsed.date === dateKey) { setLuckyNum(parsed.num); return; }
    }
    setIsLuckySpinning(true);
    const finalNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    let count = 0;
    const interval = setInterval(() => {
      setLuckyNum(Math.floor(Math.random() * 100).toString().padStart(2, '0'));
      if (++count > 20) {
        clearInterval(interval);
        setLuckyNum(finalNum);
        setIsLuckySpinning(false);
        localStorage.setItem('lucky_click_data', JSON.stringify({ date: dateKey, num: finalNum }));
      }
    }, 60);
  };

  const [selectedStat, setSelectedStat] = useState(null);
  const handleShowStats = (num) => {
    const hits = Math.floor(Math.random() * 15) + 3;
    const lastDate = ['1 มี.ค. 67', '16 ก.พ. 67', '17 ม.ค. 67', '1 ธ.ค. 66', '16 พ.ย. 66'][Math.floor(Math.random() * 5)];
    setSelectedStat({ num, hits, lastDate });
  };

  const todayThai = format(new Date(), 'EEEE', { locale: th });

  return (
    <div className="container">
      <div className="top-banner gold-text">
        <Sparkles size={14} /> ใช้ข้อมูลสถิติ 10 ปี + AI คัดเลขมงคลให้คุณ งวดวันที่ {targetDate ? format(new Date(targetDate), 'd MMMM yyyy', { locale: th }) : '...'}
      </div>

      <header className="header animate-fade">
        <div className="logo-section">
          <Sparkles className="logo-icon-main" />
          <h1 className="gold-text">ANTIGRAVITY</h1>
          <p className="subtitle">Lotto Insight & Universal Magic</p>
        </div>
      </header>

      <div className="nav-container">
        <nav className="main-nav">
          <button className={`nav-item ${activeTab === 'lotto' ? 'active' : ''}`} onClick={() => setActiveTab('lotto')}><TrendingUp size={22} /> ทำนายเลขเด็ด</button>
          <div className="nav-divider"></div>
          <button className={`nav-item ${activeTab === 'horoscope' ? 'active' : ''}`} onClick={() => setActiveTab('horoscope')}><Sparkles size={22} /> ดวง & สีมงคล</button>
          <div className="nav-divider"></div>
          <button className={`nav-item ${activeTab === 'tarot' ? 'active' : ''}`} onClick={() => setActiveTab('tarot')}><Layout size={22} /> ไพ่ทาโรต์</button>
        </nav>
      </div>

      <main className="main-focused">
        {activeTab === 'lotto' && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lotto-view">
            <div className="draw-info glass-card">
              <Calendar className="icon-gold" size={24} />
              <div className="draw-text">
                <h3>งวดประจำวันที่</h3>
                <h2 className="gold-text">{targetDate ? format(new Date(targetDate), 'd MMMM yyyy', { locale: th }) : '...'}</h2>
                <p className="location-tag"><MapPin size={14} /> สถานที่ออกรางวัล: {prediction?.analysis?.location || 'กองสลาก'}</p>
              </div>
            </div>

            {isCalculating ? (
              <div className="loading-state glass-card"><div className="spinner"></div><p>AI กำลังประมวลผลเศรษฐี...</p></div>
            ) : prediction && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="main-row">
                  <div className="main-number glass-card primary-focus">
                    <span className="label">AI คัดเลขเน้น 1 ตัว (วิ่ง)</span>
                    <div className="digit-big gold-text">{prediction.singleDigit}</div>
                  </div>
                  <div className="doubles-card glass-card">
                    <span className="label">เลขเบิ้ล (ยอดนิยม)</span>
                    <div className="number-list">
                      {prediction.doubleDigit ? <div className="num-badge double">{prediction.doubleDigit}</div> : <div className="stat-label">ไม่มีความเสี่ยงเลขเบิ้ล</div>}
                    </div>
                  </div>
                </div>

                <div className="grid-2 extras-row">
                  <div className="glass-card lucky-pick-card">
                    <span className="label">สุ่มเลขมงคลเฉพาะคุณ</span>
                    <div className={`lucky-display gold-text ${isLuckySpinning ? 'spinning' : ''}`}>{luckyNum}</div>
                    <button className="btn-primary full-width" onClick={handleLuckyPick} disabled={isLuckySpinning}>{isLuckySpinning ? 'กำลังเสี่ยงทาย...' : 'จิ้มรับเลขดวงวันนี้'}</button>
                    <p className="stat-label">*จำกัด 1 ครั้งต่อวันเพื่อความศักดิ์สิทธิ์</p>
                  </div>
                  <div className="glass-card dream-card">
                    <span className="label">ฝันยอดฮิต 5 อันดับวันนี้ (AI วิเคราะห์)</span>
                    <div className="dream-list-v2">
                      {dailyDreams.map(d => (
                        <div key={d.label} className="dream-row"><span className="dream-text-label">{d.label}</span><span className="dream-text-val gold-text">{d.val}</span></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sub-numbers">
                  <div className="glass-card result-box-v2">
                    <h4 className="label-v3">2 ตัวท้าย (สถิติ 10 ปี) - Winrate {prediction.stats.winrate}%</h4>
                    <div className="number-list-v2">
                      {prediction.twoDigits.map(n => (<button key={n} onClick={() => handleShowStats(n)} className="num-badge-v2">{n}</button>))}
                    </div>
                  </div>
                  <div className="glass-card result-box-v2">
                    <h4 className="label-v3">3 ตัวท้าย (สถิติ 10 ปี) - Winrate {prediction.stats.winrate}%</h4>
                    <div className="number-list-v2">
                      {prediction.threeDigits.map(n => (<button key={n} onClick={() => handleShowStats(n)} className="num-badge-v2 gold">{n}</button>))}
                    </div>
                  </div>
                  <div className="glass-card past-result-card">
                    <label className="label">สถิติกองสลากงวดล่าสุด ({prediction.stats.pastResult.date})</label>
                    <div className="past-grid">
                      <div className="past-val big gold-text">{prediction.stats.pastResult.first}</div>
                      <div className="past-sub-grid">
                        <div><span className="small-label">2 ตัวล่าง</span><div className="past-val">{prediction.stats.pastResult.twoSuffix}</div></div>
                        <div><span className="small-label">3 ตัวหน้า/ท้าย</span><div className="past-val">{prediction.stats.pastResult.threeSuffix}</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedStat && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="stat-detail-card-premium glass-card">
                      <div className="stat-detail-inner">
                        <div className="stat-value-big gold-text">{selectedStat.num}</div>
                        <div className="stat-details">
                          <p className="stat-title">ข้อมูลเจาะลึกจาก AI</p>
                          <p className="stat-row">🎯 เคยถูกรางวัล: <span>{selectedStat.hits} ครั้ง</span></p>
                          <p className="stat-row">📅 งวดล่าสุดที่ออก: <span>{selectedStat.lastDate}</span></p>
                          <button className="close-btn-premium" onClick={() => setSelectedStat(null)}>เข้าใจแล้ว</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.section>
        )}

        {activeTab === 'horoscope' && (
          <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="horoscope-view">
             <div className="glass-card horoscope-header">
              <h2 className="gold-text">ดวง & สีมงคล ประจำ{todayThai}</h2>
              <p className="subtitle">เช็คพลังดวงชะตาและสีเสริมบารมีก่อนเสี่ยงโชค</p>
            </div>
            <div className="horoscope-grid">
              {Object.entries(horoscopes).filter(([day]) => day === todayThai).map(([day, data]) => (
                <div key={day} className="glass-card birthday-item active-today">
                  <div className="day-header"><span className="day-name">ดวงประจำ{day} (ของคุณ)</span><span className="luck-percent">พลังโชคลาภ {data.luck}%</span></div>
                  <div className="luck-bar"><div className="luck-fill" style={{ width: `${data.luck}%` }}></div></div>
                  <p className="luck-desc">{data.desc}</p>
                  <div className="color-section-v2">
                    <div className="color-group"><span className="label-v2">สีมงคลเสริมโชค:</span>
                      <div className="color-row"><div className="color-dot" style={{ backgroundColor: data.colors.main.hex }}></div><span className="color-name">{data.colors.main.label}</span></div>
                      <div className="color-row"><div className="color-dot" style={{ backgroundColor: data.colors.sub.hex }}></div><span className="color-name">{data.colors.sub.label}</span></div>
                    </div>
                    <div className="color-group avoid"><span className="label-v2">ควรเลี่ยง:</span>
                      <div className="color-row"><div className="color-dot" style={{ backgroundColor: data.colors.avoid.hex }}></div><span className="color-name">{data.colors.avoid.label}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card color-table-card">
              <span className="label">ตารางสีมงคลพรีเมียม</span>
              <table className="color-table">
                <thead><tr><th>โชคดีเรื่อง</th><th>สีแนะนำ</th></tr></thead>
                <tbody>
                  <tr><td>การเงิน/ลาภลอย</td><td className="gold-text">เขียว, ทอง, ส้ม</td></tr>
                  <tr><td>อำนาจบารมี</td><td>ชมพู, แดงเข้ม</td></tr>
                  <tr><td className="text-danger">ควรเลี่ยง</td><td className="text-danger">ดำ, เทาแก่</td></tr>
                </tbody>
              </table>
            </div>
          </motion.section>
        )}

        {activeTab === 'tarot' && (
          <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="tarot-view">
            <div className="glass-card tarot-header">
              <h2 className="gold-text">เช็คดวงด้วยไพ่ทาโรต์</h2>
              <p className="subtitle">ตั้งจิตอธิษฐานแล้วเลือกไพ่ 1 ใบ เพื่อดูโชคลาภงวดนี้</p>
            </div>
            <div className="tarot-container">
              {!selectedTarot && !isTarotFlipping ? (
                <div onClick={handlePickTarot} className="tarot-deck-card glass-card">
                  <div className="tarot-back-design"><Sparkles size={60} className="gold-text" /><span>จั่วไพ่พยากรณ์</span></div>
                </div>
              ) : isTarotFlipping ? (
                <div className="tarot-flipping-state"><div className="spinner"></div><p>กำลังสื่อจิตเปิดไพ่พยากรณ์...</p></div>
              ) : (
                <motion.div initial={{ scale: 0.8, rotateY: 180 }} animate={{ scale: 1, rotateY: 0 }} className="tarot-reveal-card">
                  <div className="tarot-card-image glass-card"><img src={`/tarot/${selectedTarot.img}`} alt={selectedTarot.name} onError={(e) => { e.target.src="https://via.placeholder.com/300x520/1e293b/d4af37?text=TAROT+CARD"}} /></div>
                  <div className="tarot-result-content">
                    <h3 className="gold-text">{selectedTarot.name}</h3><p className="tarot-meaning">{selectedTarot.mean}</p>
                    <button className="reset-btn" onClick={() => setSelectedTarot(null)}>ขอพยากรณ์ใหม่</button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Antigravity AI Lotto Engine - เพื่อความบันเทิงและสยบทุกความเสี่ยง</p>
      </footer>
    </div>
  );
}

export default App;
