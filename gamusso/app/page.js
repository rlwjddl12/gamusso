'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

const CREW = [
  {name:'황원태',role:null,uid:'hwt1014',c:'#4a90d9'},
  {name:'잼율이',role:null,uid:'jamyul2',c:'#e89fc0'},
  {name:'야뿌',role:null,uid:'ekrekrnfl9',c:'#7ec8e3'},
  {name:'하티하티',role:null,uid:'gkxl1004',c:'#f4a460'},
  {name:'딩굴',role:null,uid:'dinggoolx3',c:'#90ee90'},
  {name:'투냥츠',role:null,uid:'toocats',c:'#ffb6c1'},
  {name:'단수아',role:null,uid:'tndk321',c:'#dda0dd'},
  {name:'희꾸미',role:null,uid:'ddr9463',c:'#20b2aa'},
  {name:'연보라',role:null,uid:'200501',c:'#9370db'},
  {name:'연치민',role:null,uid:'yeonchimin',c:'#6495ed'},
  {name:'쨈도은',role:null,uid:'odoeun',c:'#ffd700'},
  {name:'정다니',role:null,uid:'wjdekgus112',c:'#cd853f'},
  {name:'채하',role:null,uid:'fbcogk',c:'#ff7f50'},
  {name:'감초',role:null,uid:'33h2101',c:'#66cdaa'},
  {name:'아린',role:null,uid:'59590423',c:'#ba55d3'},
]

const PIGGY_GOALS = {
  'hwt1014': 400000,
  '33h2101': 150000,
  'fbcogk':  200000,
  'tndk321': 200000,
  'yeonchimin': 50000,
  'ekrekrnfl9': 80000,
  'dinggoolx3': 90000,
  '200501': 100000,
  '59590423': 100000,
  'ddr9463': 100000,
}

function profileImg(uid){ return `https://stimg.sooplive.com/LOGO/${uid.substring(0,2)}/${uid}/${uid}.jpg` }
function stationUrl(uid){ return `https://www.sooplive.com/station/${uid}` }
function liveUrl(uid){ return `https://play.sooplive.com/${uid}` }

// ── 멤버 카드 ──
function MemberCard({ m, isLive }) {
  return (
    <a href={stationUrl(m.uid)} target="_blank" rel="noopener" className={styles.idCard} style={{'--card-color':m.c}}>
      <div className={styles.cardHole} />
      <div className={styles.cardLanyard} />
      <div className={styles.cardImgWrap}>
        <img src={profileImg(m.uid)} alt={m.name} className={styles.cardImg}
          onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} />
        <div className={styles.cardImgFallback}>{m.name[0]}</div>
        {isLive && <div className={styles.liveDot}>LIVE</div>}
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.cardNameRow}>
          <span className={isLive ? styles.liveBullet : styles.offBullet} />
          <div className={styles.cardName}>{m.name}</div>
        </div>
        <div className={styles.cardSub}>원더독</div>
        {m.role && <div className={styles.cardRole}>{m.role}</div>}
      </div>
    </a>
  )
}

// ── 라이브 카드 ──
function LiveCard({ m, thumb, title }) {
  return (
    <a href={liveUrl(m.uid)} target="_blank" rel="noopener" className={styles.liveCard}>
      <div className={styles.liveThumbWrap}>
        {thumb
          ? <img src={thumb} alt={m.name} className={styles.liveThumb} />
          : <div className={styles.liveThumbFallback}>📡</div>
        }
        <div className={styles.playOverlay}>▶</div>
        <div className={styles.liveBadge}>● LIVE</div>
      </div>
      <div className={styles.liveInfo}>
        <div>
          <div className={styles.liveName}>{m.name}</div>
          <div className={styles.liveTitle}>{title || ''}</div>
        </div>
      </div>
    </a>
  )
}

// ── 저금통 행 ──
function PiggyBankRow({ entry }) {
  const member = CREW.find(m => m.uid === entry.uid)
  const goal = PIGGY_GOALS[entry.uid]
  const achieved = goal ? entry.amount >= goal : false
  const pct = goal ? Math.min(100, Math.floor((entry.amount / goal) * 100)) : null

  // 남은 시간 카운트다운 (API에서 remain_time 받아서 1초마다 -1)
  const [countdown, setCountdown] = useState(entry.remain_time || 0)
  useEffect(() => {
    if (!entry.remain_time) return
    setCountdown(entry.remain_time)
    const t = setInterval(() => setCountdown(v => Math.max(0, v - 1)), 1000)
    return () => clearInterval(t)
  }, [entry.remain_time])

  const fmtTime = (sec) => {
    if (!sec) return null
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }

  return (
    <div className={styles.piggyRow}>
      <div className={styles.piggyRowTop}>
        <div className={styles.piggyRowNameWrap}>
          <span className={styles.piggyColorDot} style={{ background: member?.c || '#4a90d9' }} />
          <span className={styles.piggyRowName} style={{ color: member?.c || '#4a90d9' }}>
            {member?.name || entry.uid}
          </span>
          {entry.uid === 'hwt1014' && (() => {
            const end = new Date('2027-03-04T16:00:00+09:00')
            const now = new Date()
            const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
            const done = diff <= 0
            return (
              <span style={{
                display:'inline-flex', alignItems:'center', gap:'4px',
                background: done ? 'rgba(34,197,94,0.12)' : 'rgba(99,102,241,0.12)',
                border: `1px solid ${done ? 'rgba(34,197,94,0.3)' : 'rgba(99,102,241,0.3)'}`,
                borderRadius:'20px', padding:'2px 10px',
                fontSize:'11px', fontWeight:600,
                color: done ? '#4ade80' : '#818cf8', whiteSpace:'nowrap',
              }}>
                {done ? '🎉 방종 완료!' : `🎙 노방종 D-${diff}  · 2027.03.04`}
              </span>
            )
          })()}
          {achieved && <span className={styles.piggyGoalBadge}>🎉 목표 달성</span>}
        </div>
        <div className={styles.piggyRowNumbers}>
          <span className={styles.piggyAmountMain}>{entry.amount?.toLocaleString()}개</span>
          {goal && (
            <span className={styles.piggyGoalText}>
              / {goal.toLocaleString()}개 · {pct}%
            </span>
          )}
        </div>
      </div>
      {goal && (
        <div className={styles.piggyBarTrack}>
          <div
            className={styles.piggyBarFill}
            style={{ width:`${pct}%`, background: achieved ? '#ffd700' : (member?.c || '#4a90d9') }}
          />
        </div>
      )}
    </div>
  )
}


// ── 메인 ──
export default function Home() {
  const [liveData, setLiveData]     = useState({})
  const [news, setNews]             = useState([])
  const [piggyBanks, setPiggyBanks] = useState([])

  // ── 라이브 폴링 (3분) ──
  useEffect(() => {
    const check = async () => {
      try {
        const uids = CREW.map(m => m.uid).join(',')
        const res = await fetch(`/api/live?uids=${uids}`)
        const data = await res.json()
        setLiveData(data)
      } catch { setLiveData({}) }
    }
    check()
    const t = setInterval(check, 3 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  // ── 뉴스 ──
  useEffect(() => {
    fetch('/news.json').then(r=>r.json()).then(setNews).catch(()=>{})
  }, [])

  // ── 저금통 폴링 (1분) ──
  useEffect(() => {
    const load = () => {
      fetch(`/api/piggybank?t=${Date.now()}`)
        .then(r => r.json())
        .then(setPiggyBanks)
        .catch(()=>{})
    }
    load()
    const t = setInterval(load, 60 * 1000)
    return () => clearInterval(t)
  }, [])

  // ── 경과 시간 타이머 + 1초마다 순위 갱신 ──
  const liveMembers = CREW.filter(m => liveData[m.uid]?.live)
  const offMembers  = CREW.filter(m => !liveData[m.uid]?.live)

  return (
    <main>
      {/* 히어로 */}
      <div className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1.2rem',fontWeight:600,background:'#333'}}>
          이미지 수정중
        </div>
      </div>

      {/* 라이브 */}
      {liveMembers.length > 0 && (
        <div className={styles.container}>
          <div className={styles.secLabel}>🔴 LIVE NOW · {liveMembers.length}명 방송중</div>
          <div className={styles.liveGrid}>
            {liveMembers.map(m => (
              <LiveCard key={m.uid} m={m} thumb={liveData[m.uid]?.thumb} title={liveData[m.uid]?.title} />
            ))}
          </div>
        </div>
      )}

      {/* 저금통 */}
      {piggyBanks.length > 0 && (
        <div className={styles.container}>
          <div className={styles.secLabel}>🐷 삼국지 저금통</div>
          <div className={styles.piggyTotal}>
            종합 - 삼국지 {piggyBanks.reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}개
          </div>
          <div className={styles.piggyList}>
            {piggyBanks.map((entry, i) => (
              <PiggyBankRow key={entry.uid + i} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {/* 소식 */}
      {news.length > 0 && (
        <div className={styles.container}>
          <div className={styles.secLabel}>📰 원더독 소식</div>
          <div className={styles.newsGrid}>
            {news.map((n, i) => (
              <div key={i} className={styles.newsCard}>
                {n.img && <img src={n.img} alt={n.title} className={styles.newsImg} />}
                <div className={styles.newsBody}>
                  <div className={styles.newsMeta}>
                    <span className={styles.newsTag}>{n.tag}</span>
                    <span className={styles.newsDate}>{n.date}</span>
                  </div>
                  <div className={styles.newsTitle}>{n.title}</div>
                  <div className={styles.newsDesc}>{n.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 오프라인 멤버 */}
      <div className={styles.container}>
        <div className={styles.secLabel}>● 오프라인 멤버</div>
        <div className={styles.cardGrid}>
          {offMembers.map(m => <MemberCard key={m.uid} m={m} isLive={false} />)}
        </div>
      </div>

      <footer className={styles.footer}>원더독 팬페이지 · 팬메이드 비공식 페이지</footer>
    </main>
  )
}
