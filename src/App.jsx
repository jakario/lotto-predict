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

  // Expanded Dream database
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

  // Pick 5 dreams based on date
  const [dailyDreams, setDailyDreams] = useState([]);

  const horoscopes = {
    'วันจันทร์': { 
      luck: 85, 
      desc: 'ปีแห่งข่าวดี! มีเกณฑ์ได้รับโชคลาภจากการเดินทางและติดต่อสื่อสาร', 
      colors: { 
        main: { label: 'ขาวมุก', hex: '#FFFFFF' }, 
        sub: { label: 'ฟ้าใส', hex: '#60A5FA' }, 
        avoid: { label: 'สีแดง, ส้ม', hex: '#EF4444' } 
      } 
    },
    'วันอังคาร': { 
      luck: 90, 
      desc: 'ดวงการงานพุ่งแรง! ผลงานโดดเด่น มีโอกาสได้เลื่อนขั้นเลื่อนตำแหน่งสูงมาก', 
      colors: { 
        main: { label: 'ชมพู', hex: '#F472B6' }, 
        sub: { label: 'เหลือง', hex: '#FDE047' }, 
        avoid: { label: 'น้ำเงิน, ดำ', hex: '#1E3A8A' } 
      } 
    },
    'วันพุธ': { 
      luck: 92, 
      desc: 'ปีแห่งความสำเร็จในการเจรจา ค้าขายร่ำรวย ปิดดีลใหญ่ได้ดังใจหวัง', 
      colors: { 
        main: { label: 'เขียวเข้ม', hex: '#166534' }, 
        sub: { label: 'ทอง', hex: '#EAB308' }, 
        avoid: { label: 'แดง, ม่วง', hex: '#991B1B' } 
      } 
    },
    'วันพฤหัสบดี': { 
      luck: 78, 
      desc: 'ปีแห่งการเรียนรู้และการพัฒนาตนเอง สิ่งที่ทุ่มเทศึกษาจะนำพาความสำเร็จมาให้', 
      colors: { 
        main: { label: 'ส้ม', hex: '#FB923C' }, 
        sub: { label: 'ทองแดง', hex: '#B45309' }, 
        avoid: { label: 'ดำ, น้ำเงิน', hex: '#000000' } 
      } 
    },
    'วันศุกร์': { 
      luck: 95, 
      desc: 'ดวงความรักสดใสที่สุด! มีเกณฑ์สละโสดหรือพบเจอคู่แท้ที่เกื้อหนุนกัน', 
      colors: { 
        main: { label: 'ชมพูอ่อน', hex: '#FBCFE8' }, 
        sub: { label: 'เขียวตอง', hex: '#86EFAC' }, 
        avoid: { label: 'เทา, น้ำเงิน', hex: '#4B5563' } 
      } 
    },
    'วันเสาร์': { 
      luck: 88, 
      desc: 'โชคลาภพุ่งเข้าหา! จะมีโชคจากความฝันที่แม่นยำหรือลางสังหรณ์พิเศษ', 
      colors: { 
        main: { label: 'ม่วง', hex: '#A855F7' }, 
        sub: { label: 'เหลืองมุก', hex: '#FEF9C3' }, 
        avoid: { label: 'แดง, ส้ม', hex: '#DC2626' } 
      } 
    },
    'วันอาทิตย์': { 
      luck: 80, 
      desc: 'ปีแห่งการเริ่มต้นใหม่ สิ่งที่เคยหยุดชะงักจะกลับมาเดินหน้าก้าวกระโดด', 
      colors: { 
        main: { label: 'แดง', hex: '#EF4444' }, 
        sub: { label: 'เหลืองนวล', hex: '#FEF08A' }, 
        avoid: { label: 'ม่วง, ดำ', hex: '#581C87' } 
      } 
    }
  };

  useEffect(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    const dateKey = `${year}-${month}-${day}`;

    // 1. Handle Persistent Lucky Number
    const savedLucky = localStorage.getItem('lucky_click_data');
    if (savedLucky) {
      const parsed = JSON.parse(savedLucky);
      if (parsed.date === dateKey) {
        setLuckyNum(parsed.num);
      }
    }

    // 2. Generate daily dreams
    const seed = day + month + year;
    const shuffled = [...dreamPool].sort(() => 0.5 - (Math.sin(seed) * 0.5 + 0.5));
    setDailyDreams(shuffled.slice(0, 5));

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

  const handleLuckyPick = () => {
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    
    // Check if already clicked today
    const savedLucky = localStorage.getItem('lucky_click_data');
    if (savedLucky) {
      const parsed = JSON.parse(savedLucky);
      if (parsed.date === dateKey) {
        setLuckyNum(parsed.num);
        return;
      }
    }

    setIsLuckySpinning(true);
    let count = 0;
    const finalNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    const interval = setInterval(() => {
      setLuckyNum(Math.floor(Math.random() * 100).toString().padStart(2, '0'));
      count++;
      if (count > 20) {
        clearInterval(interval);
        setLuckyNum(finalNum);
        setIsLuckySpinning(false);
        // Save to localStorage
        localStorage.setItem('lucky_click_data', JSON.stringify({
          date: dateKey,
          num: finalNum
        }));
      }
    }, 60);
  };

  const [selectedStat, setSelectedStat] = useState(null);

  const handleShowStats = (num) => {
    // Simulated deep stats based on the logic
    const hits = Math.floor(Math.random() * 15) + 3; // 3-18 hits
    const lastDate = ['1 มี.ค. 67', '16 ก.พ. 67', '17 ม.ค. 67', '1 ธ.ค. 66', '16 พ.ย. 66'][Math.floor(Math.random() * 5)];
    setSelectedStat({ num, hits, lastDate });
  };

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
                        <span className="label">ฝันยอดฮิต 5 อันดับวันนี้ (AI วิเคราะห์)</span>
                        <div className="dream-list-v2">
                          {dailyDreams.map(d => (
                            <div key={d.label} className="dream-row">
                              <span className="dream-text-label">{d.label}</span>
                              <span className="dream-text-val gold-text">{d.val}</span>
                            </div>
                          ))}
                        </div>
                        <p className="stat-label">*สุ่มวิเคราะห์ฝันเด่นประจำวัน {prediction?.analysis?.day}</p>
                      </div>
                    </div>

                    <div className="sub-numbers">
                      <div className="glass-card result-box-v2">
                        <h4 className="label-v3">2 ตัวท้าย (สถิติ 10 ปี) - Winrate {prediction.stats.winrate}%</h4>
                        <div className="number-list-v2">
                          {prediction.twoDigits.map(n => (
                            <button key={n} onClick={() => handleShowStats(n)} className="num-badge-v2">
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="glass-card result-box-v2">
                        <h4 className="label-v3">3 ตัวท้าย (สถิติ 10 ปี) - Winrate {prediction.stats.winrate}%</h4>
                        <div className="number-list-v2">
                          {prediction.threeDigits.map(n => (
                            <button key={n} onClick={() => handleShowStats(n)} className="num-badge-v2 gold">
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="glass-card past-result-card">
                        <label className="label">สถิติกองสลากงวดล่าสุด ({prediction.stats.pastResult.date})</label>
                        <div className="past-grid">
                          <div className="past-val big gold-text">{prediction.stats.pastResult.first}</div>
                          <div className="past-sub-grid">
                            <div>
                              <span className="small-label">2 ตัวล่าง</span>
                              <div className="past-val">{prediction.stats.pastResult.twoSuffix}</div>
                            </div>
                            <div>
                              <span className="small-label">3 ตัวหน้า/ท้าย</span>
                              <div className="past-val">{prediction.stats.pastResult.threeSuffix}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedStat && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="stat-detail-card-premium glass-card"
                        >
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
              {Object.entries(horoscopes)
                .filter(([day]) => day === todayThai)
                .map(([day, data]) => (
                <div key={day} className="glass-card birthday-item active-today">
                  <div className="day-header">
                    <span className="day-name">ดวงประจำ{day} (ของคุณ)</span>
                    <span className="luck-percent">พลังโชคลาภ {data.luck}%</span>
                  </div>
                  <div className="luck-bar"><div className="luck-fill" style={{ width: `${data.luck}%` }}></div></div>
                  <p className="luck-desc">{data.desc}</p>
                  <div className="color-section-v2">
                    <div className="color-group">
                      <span className="label-v2">สีมงคลเสริมโชค:</span>
                      <div className="color-info">
                        <div className="color-row">
                          <div className="color-dot" style={{ backgroundColor: data.colors.main.hex }}></div>
                          <span className="color-name">{data.colors.main.label} (การเงิน/งาน)</span>
                        </div>
                        <div className="color-row">
                          <div className="color-dot" style={{ backgroundColor: data.colors.sub.hex }}></div>
                          <span className="color-name">{data.colors.sub.label} (ความรัก)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="color-group avoid">
                      <span className="label-v2">ควรเลี่ยง:</span>
                      <div className="color-row">
                        <div className="color-dot" style={{ backgroundColor: data.colors.avoid.hex }}></div>
                        <span className="color-name">{data.colors.avoid.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="tomorrow-hint">อยากรู้ดวงวันพรุ่งนี้? อย่าลืมกลับมาเช็คใหม่ที่นี่นะครับ ✨</p>

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
