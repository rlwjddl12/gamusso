'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './page.module.css'

const CREW = [
  { name: '가습기', role: '소장님', uid: 'hwt1014',     c: 0 },
  { name: '새잎',   role: '반장',   uid: 'likey0u',     c: 1 },
  { name: '잼율이', role: null,     uid: 'jamyul2',     c: 2 },
  { name: '기찬하', role: null,     uid: 'khj011219',   c: 3 },
  { name: '야뿌',   role: null,     uid: 'ekrekrnfl9',  c: 4 },
  { name: '하티하티',role: null,    uid: 'gkxl1004',    c: 5 },
  { name: '딩굴',   role: null,     uid: 'dinggoolx3',  c: 6 },
  { name: '투냥츠', role: null,     uid: 'toocats',     c: 7 },
  { name: '단수아', role: null,     uid: 'tndk321',     c: 0 },
  { name: '류채아', role: null,     uid: 'gio12025',    c: 1 },
  { name: '희꾸미', role: null,     uid: 'ddr9463',     c: 4 },
  { name: '연보라', role: null,     uid: '200501',      c: 3 },
  { name: '연치민', role: null,     uid: 'yeonchimin',  c: 5 },
  { name: '쨈도은', role: null,     uid: 'odoeun',      c: 6 },
  { name: '정다니', role: null,     uid: 'wjdekgus112', c: 2 },
]

const AV_COLORS = [
  { bg: 'rgba(59,130,246,.18)',  color: '#93c5fd' },
  { bg: 'rgba(16,185,129,.18)',  color: '#6ee7b7' },
  { bg: 'rgba(244,114,182,.18)', color: '#f9a8d4' },
  { bg: 'rgba(167,139,250,.18)', color: '#c4b5fd' },
  { bg: 'rgba(251,146,60,.18)',  color: '#fdba74' },
  { bg: 'rgba(251,191,36,.18)',  color: '#fde68a' },
  { bg: 'rgba(52,211,153,.18)',  color: '#6ee7b7' },
  { bg: 'rgba(248,113,113,.18)', color: '#fca5a5' },
]

function stationUrl(uid) { return `https://www.sooplive.com/station/${uid}` }
function liveUrl(uid, broadNo) { return broadNo ? `https://play.sooplive.com/${uid}/${broadNo}` : stationUrl(uid) }

export default function Home() {
  const [liveInfo, setLiveInfo] = useState({})
  const [lastCheck, setLastCheck] = useState('')
  const [loading, setLoading] = useState(false)

  const checkAll = useCallback(async () => {
    setLoading(true)
    const results = await Promise.all(
      CREW.map(async m => {
        try {
          const res = await fetch(`/api/live?uid=${m.uid}`)
          const data = await res.json()
          return [m.uid, data]
        } catch {
          return [m.uid, { live: false }]
        }
      })
    )
    const info = Object.fromEntries(results)
    setLiveInfo(info)
    const now = new Date()
    setLastCheck(`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`)
    setLoading(false)
  }, [])

  useEffect(() => {
    checkAll()
    const timer = setInterval(checkAll, 3 * 60 * 1000)
    return () => clearInterval(timer)
  }, [checkAll])

  const liveMembers = CREW.filter(m => liveInfo[m.uid]?.live)
  const offMembers  = CREW.filter(m => !liveInfo[m.uid]?.live)

  return (
    <main>
      {/* HERO */}
      <div className={styles.hero}>
        <img src="/banner.png" alt="가무소 크루" />
        <div className={styles.heroOverlay}>
          <div>
            <h1>🎙️ 가무소</h1>
            <p>가습기 사무소 · 아프리카TV 크루 · 멤버 15인</p>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* TOPBAR */}
        <div className={styles.topbar}>
          <div>
            <div className={styles.livePill}>
              <span className={styles.dot} />
              <span>{liveMembers.length}명 라이브 중</span>
            </div>
            <div className={styles.lastCheck}>
              {lastCheck ? `마지막 확인: ${lastCheck}` : '확인 중...'}
            </div>
          </div>
          <button
            className={`${styles.refreshBtn} ${loading ? styles.spinning : ''}`}
            onClick={checkAll}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M1 4v6h6M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            새로고침
          </button>
        </div>

        {/* LIVE SECTION */}
        {liveMembers.length > 0 && (
          <div className={styles.section}>
            <div className={styles.secLabel}>🔴 라이브 중</div>
            <div className={styles.liveGrid}>
              {liveMembers.map(m => {
                const info = liveInfo[m.uid] || {}
                const av = AV_COLORS[m.c]
                return (
                  <a
                    key={m.uid}
                    href={liveUrl(m.uid, info.broadNo)}
                    target="_blank"
                    rel="noopener"
                    className={styles.liveCard}
                  >
                    <div className={styles.thumbWrap}>
                      {info.thumb
                        ? <img src={info.thumb} alt={m.name} onError={e => e.target.style.display='none'} />
                        : <div className={styles.thumbPlaceholder}>📺</div>
                      }
                      <div className={styles.liveTag}>LIVE</div>
                      {info.viewers > 0 && (
                        <div className={styles.viewerTag}>
                          <span className={styles.viewerDot} />
                          {info.viewers.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className={styles.liveInfo}>
                      <div className={styles.liveStreamer}>
                        <div className={styles.miniAvatar} style={{ background: av.bg, color: av.color, boxShadow: '0 0 0 2px #ff4444' }}>
                          {m.name[0]}
                        </div>
                        <div>
                          <span className={styles.streamerName}>{m.name}</span>
                          {m.role && <span className={styles.roleBadge}>{m.role}</span>}
                        </div>
                      </div>
                      {info.title && <div className={styles.liveTitle}>{info.title}</div>}
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* OFFLINE SECTION */}
        <div className={styles.section}>
          <div className={styles.secLabel}>{liveMembers.length > 0 ? '오프라인' : '전체 멤버'}</div>
          <div className={styles.offGrid}>
            {offMembers.map(m => {
              const av = AV_COLORS[m.c]
              return (
                <a
                  key={m.uid}
                  href={stationUrl(m.uid)}
                  target="_blank"
                  rel="noopener"
                  className={styles.offCard}
                >
                  <div className={styles.avatar} style={{ background: av.bg, color: av.color }}>
                    {m.name[0]}
                  </div>
                  <div className={styles.cardName}>{m.name}</div>
                  {m.role
                    ? <div className={styles.cardRole}>{m.role}</div>
                    : <div style={{ height: 18 }} />
                  }
                  <div className={styles.cardStatus}>○ 오프라인</div>
                  <div className={styles.cardGo}>↗ 채널 바로가기</div>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        가무소 팬페이지 · 팬메이드 비공식 페이지
      </footer>
    </main>
  )
}
