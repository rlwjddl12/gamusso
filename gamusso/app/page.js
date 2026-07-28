'use client'

import { useState, useEffect, useRef } from 'react'
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

// 도전 미션 집계 대상 (원더독 10명, uid 기준)
const MISSION_UIDS = ['hwt1014','fbcogk','tndk321','59590423','ekrekrnfl9','dinggoolx3','200501','ddr9463','33h2101','yeonchimin']

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

// ── 도전 미션 순위 행 ──
function MissionRankRow({ rank, uid, gain, color, name }) {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}위`
  const maxBar = 20
  const barFilled = gain > 0 ? Math.max(1, Math.round((gain / gain) * maxBar)) : 0

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'10px',
      padding:'10px 14px',
      background: rank <= 3 ? (rank===1?'rgba(255,215,0,0.12)':rank===2?'rgba(192,192,192,0.12)':'rgba(205,127,50,0.12)') : 'rgba(255,255,255,0.04)',
      borderRadius:'8px',
      borderLeft: `3px solid ${color}`,
      marginBottom:'6px',
    }}>
      <span style={{fontSize:'18px',minWidth:'32px',textAlign:'center'}}>{medal}</span>
      <span style={{fontWeight:700,color,minWidth:'70px',fontSize:'14px'}}>{name}</span>
      <span style={{
        fontFamily:'monospace',fontSize:'12px',
        color: gain > 0 ? '#4ade80' : '#94a3b8',
        flex:1,letterSpacing:'1px'
      }}>
        {'█'.repeat(Math.max(0, Math.round((gain / Math.max(gain,1)) * 12)))}
        {'░'.repeat(Math.max(0, 12 - Math.round((gain / Math.max(gain,1)) * 12)))}
      </span>
      <span style={{
        fontWeight:700, fontSize:'15px',
        color: gain > 0 ? '#4ade80' : '#94a3b8',
        minWidth:'80px', textAlign:'right'
      }}>
        {gain > 0 ? `+${gain.toLocaleString()}` : gain === 0 ? '―' : gain.toLocaleString()}
      </span>
    </div>
  )
}

// ── 메인 ──
export default function Home() {
  const [liveData, setLiveData]     = useState({})
  const [news, setNews]             = useState([])
  const [piggyBanks, setPiggyBanks] = useState([])

  // 도전 미션 상태
  const [missionActive, setMissionActive]     = useState(false)
  const [missionSnap, setMissionSnap]         = useState(null)   // 시작 시점 스냅샷
  const [missionStartTime, setMissionStartTime] = useState(null)
  const [elapsed, setElapsed]                 = useState(0)      // 경과 초
  const elapsedRef = useRef(null)

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

  // ── 경과 시간 타이머 (도전 중 1초마다) ──
  useEffect(() => {
    if (missionActive) {
      elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(elapsedRef.current)
    }
    return () => clearInterval(elapsedRef.current)
  }, [missionActive])

  // ── 도전 시작 ──
  const startMission = () => {
    if (piggyBanks.length === 0) {
      alert('저금통 데이터가 아직 로드되지 않았어요. 잠시 후 다시 눌러주세요!')
      return
    }
    // 원더독 10명만 스냅샷
    const snap = {}
    piggyBanks.forEach(e => {
      if (MISSION_UIDS.includes(e.uid)) snap[e.uid] = e.amount
    })
    setMissionSnap(snap)
    setMissionStartTime(new Date())
    setMissionActive(true)
    setElapsed(0)
  }

  // ── 도전 리셋 ──
  const resetMission = () => {
    if (!confirm('도전 미션을 리셋할까요?\n현재 시각부터 다시 집계됩니다.')) return
    startMission()
  }

  // ── 경과 시간 포맷 ──
  const formatElapsed = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0')
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  // ── 도전 순위 계산 ──
  const missionRanks = (() => {
    if (!missionActive || !missionSnap) return []
    const rows = MISSION_UIDS.map(uid => {
      const member = CREW.find(m => m.uid === uid)
      const current = piggyBanks.find(e => e.uid === uid)?.amount ?? missionSnap[uid] ?? 0
      const gain = current - (missionSnap[uid] ?? 0)
      return { uid, name: member?.name || uid, color: member?.c || '#888', gain }
    })
    return rows.sort((a, b) => b.gain - a.gain)
  })()

  const totalGain = missionRanks.reduce((s, r) => s + Math.max(r.gain, 0), 0)

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

      {/* ── 도전 미션 집계 ── */}
      <div className={styles.container}>
        <div className={styles.secLabel}>🏆 도전 미션 집계</div>

        {!missionActive ? (
          /* 시작 전 */
          <div style={{
            background:'linear-gradient(135deg,#1a1a2e,#16213e)',
            borderRadius:'14px', padding:'28px 24px', textAlign:'center',
            border:'1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{fontSize:'36px',marginBottom:'10px'}}>🐾</div>
            <div style={{color:'#fff',fontSize:'18px',fontWeight:700,marginBottom:'8px'}}>원더독 도전 미션</div>
            <div style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'22px',lineHeight:1.6}}>
              버튼을 누르면 지금 시각부터 별풍선 획득량을 집계합니다<br/>
              저금통 폴링(1분)마다 순위가 자동으로 갱신됩니다
            </div>
            <button
              onClick={startMission}
              style={{
                background:'linear-gradient(135deg,#667eea,#764ba2)',
                color:'#fff', border:'none', borderRadius:'10px',
                padding:'13px 32px', fontSize:'15px', fontWeight:700,
                cursor:'pointer', letterSpacing:'0.5px',
                boxShadow:'0 4px 20px rgba(102,126,234,0.4)',
              }}
            >
              🚀 도전 미션 시작
            </button>
          </div>
        ) : (
          /* 진행 중 */
          <div style={{
            background:'linear-gradient(135deg,#0f1923,#1a2a3a)',
            borderRadius:'14px', padding:'20px',
            border:'1px solid rgba(255,255,255,0.08)'
          }}>
            {/* 헤더 */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px',flexWrap:'wrap',gap:'10px'}}>
              <div>
                <div style={{color:'#fff',fontWeight:700,fontSize:'15px'}}>🏆 실시간 순위</div>
                <div style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',marginTop:'3px'}}>
                  시작: {missionStartTime?.toLocaleTimeString('ko-KR')} &nbsp;·&nbsp;
                  경과: <span style={{color:'#fbbf24',fontWeight:600}}>{formatElapsed(elapsed)}</span>
                  &nbsp;·&nbsp; 1분마다 자동 갱신
                </div>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <div style={{
                  background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',
                  borderRadius:'8px',padding:'6px 12px',fontSize:'13px',color:'#4ade80',fontWeight:700
                }}>
                  합계 +{totalGain.toLocaleString()}개
                </div>
                <button
                  onClick={resetMission}
                  style={{
                    background:'rgba(220,38,38,0.15)',border:'1px solid rgba(220,38,38,0.4)',
                    color:'#f87171',borderRadius:'8px',padding:'6px 14px',
                    fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'
                  }}
                >
                  🔄 리셋
                </button>
              </div>
            </div>

            {/* 순위 목록 */}
            <div>
              {missionRanks.map((r, i) => (
                <MissionRankRow
                  key={r.uid}
                  rank={i + 1}
                  uid={r.uid}
                  gain={r.gain}
                  color={r.color}
                  name={r.name}
                />
              ))}
            </div>

            {/* 진행 바 (전체 대비) */}
            {missionRanks.length > 0 && missionRanks[0].gain > 0 && (
              <div style={{marginTop:'14px'}}>
                {missionRanks.map((r, i) => {
                  const max = missionRanks[0].gain || 1
                  const pct = Math.max(0, Math.round((r.gain / max) * 100))
                  return (
                    <div key={r.uid} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'5px'}}>
                      <span style={{color:r.color,fontSize:'11px',fontWeight:600,minWidth:'52px',textAlign:'right'}}>{r.name}</span>
                      <div style={{flex:1,background:'rgba(255,255,255,0.06)',borderRadius:'4px',height:'8px'}}>
                        <div style={{width:`${pct}%`,height:'100%',background:r.color,borderRadius:'4px',transition:'width 0.6s ease'}} />
                      </div>
                      <span style={{color:r.color,fontSize:'11px',fontWeight:700,minWidth:'64px'}}>
                        {r.gain > 0 ? `+${r.gain.toLocaleString()}` : '0'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

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
  )
}
