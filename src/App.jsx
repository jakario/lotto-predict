import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, Gauge, Info, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { predictLotto } from './engine/lottoEngine';
import './App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [targetDate, setTargetDate] = useState('');

  // Auto-determine next draw date
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
    
    // Initial prediction
    setIsCalculating(true);
    setTimeout(() => {
      setPrediction(predictLotto(formatted, 'Nonthaburi'));
      setIsCalculating(false);
    }, 1200);
  }, []);

  return (
    <div className="container">
      <header className="header animate-fade">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="logo-container"
        >
          <Sparkles className="logo-icon" />
        </motion.div>
        <h1 className="gold-text">LOTTO PREDICTOR</h1>
        <p className="subtitle">ระบบวิเคราะห์เลขเด็ดจากสถิติ 10 ปี (อัตโนมัติ)</p>
      </header>

      <main className="main-focused">
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
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="loading-state glass-card"
              >
                <div className="spinner"></div>
                <p>กำลังเจาะข้อมูลสถิติย้อนหลัง 10 ปี...</p>
              </motion.div>
            ) : prediction && (
              <motion.div 
                key="result"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="result-content"
              >
                <div className="main-row">
                  <div className="main-number glass-card primary-focus">
                    <span className="label">เลขเน้น 1 ตัว (วิ่ง)</span>
                    <div className="digit-big gold-text">{prediction.singleDigit}</div>
                    <div className="stat-label">วิเคราะห์จากความถี่สูงสุดในรอบ 10 ปี</div>
                  </div>

                  <div className="doubles-card glass-card">
                    <span className="label">เลขเบิ้ล (ยอดนิยม)</span>
                    <div className="number-list">
                      {prediction.doubles.map(n => (
                        <div key={n} className="num-badge double">{n}</div>
                      ))}
                    </div>
                    <div className="stat-label">อิงกระแสโซเชียลและสถิติ</div>
                  </div>
                </div>

                <div className="sub-numbers">
                  <div className="glass-card result-box">
                    <span className="label">เลขเด็ด 2 ตัวท้าย (ออกบ่อย 10 ปี)</span>
                    <div className="number-list">
                      {prediction.twoDigits.map((n, i) => (
                        <motion.span 
                          key={n} 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          transition={{ delay: i * 0.1 }}
                          className="num-badge"
                        >
                          {n}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card result-box">
                    <span className="label">เลขเด็ด 3 ตัวท้าย (ออกบ่อย 10 ปี)</span>
                    <div className="number-list">
                      {prediction.threeDigits.map((n, i) => (
                        <motion.span 
                          key={n} 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          transition={{ delay: i * 0.1 + 0.3 }}
                          className="num-badge gold"
                        >
                          {n}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="stats-row grid-2">
                  <div className="glass-card winrate-card">
                    <div className="win-header">
                      <TrendingUp className="icon-gold" size={24} />
                      <span className="label">อัตราความแม่นยำ (Winrate)</span>
                    </div>
                    <div className="win-value gold-text">{prediction.stats.winrate}%</div>
                    <p className="win-desc">อิงสถิติการเข้าเป้าจากกลุ่มเลขแนะนำย้อนหลัง 10 ปี</p>
                  </div>

                  <div className="glass-card past-result-card">
                    <span className="label">ผลรางวัลย้อนหลัง ({prediction.stats.pastResult.date})</span>
                    <div className="past-grid">
                      <div className="past-item">
                        <span className="small-label">รางวัลที่ 1</span>
                        <div className="past-val big">{prediction.stats.pastResult.firstPrize}</div>
                      </div>
                      <div className="past-sub-grid">
                        <div className="past-item">
                          <span className="small-label">2 ตัวท้าย</span>
                          <div className="past-val gold-text">{prediction.stats.pastResult.twoSuffix}</div>
                        </div>
                        <div className="past-item">
                          <span className="small-label">3 ตัวหน้า/ท้าย</span>
                          <div className="past-val">{prediction.stats.pastResult.threeSuffix}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analysis-summary glass-card">
                  <div className="analysis-item">
                    <TrendingUp size={20} className="icon-gold" />
                    <span>
                      สรุปวิเคราะห์: อิงสถิติ{prediction.analysis.day} เดือน{prediction.analysis.month} ณ {prediction.analysis.location} และความถี่สะสม 10 ปี
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Antigravity AI Lotto Engine - เพื่อความบันเทิงและเพื่อลุ้นสร้างอนาคต</p>
      </footer>
    </div>
  );
}

export default App;
