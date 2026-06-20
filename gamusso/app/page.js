js'use client'

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
  { bg: 'rgba(59,130,246,.25)',  color: '#93c5fd' },
  { bg: 'rgba(16,185,129,.25)',  color: '#6ee7b7' },
  { bg: 'rgba(244,114,182,.25)', color: '#f9a8d4' },
  { bg: 'rgba(167,139,250,.25)', color: '#c4b5fd' },
  { bg: 'rgba(251,146,60,.25)',  color: '#fdba74' },
  { bg: 'rgba(251,191,36,.25)',  color: '#fde68a' },
  { bg: 'rgba(52,211,153,.25)',  color: '#6ee7b7' },
  { bg: 'rgba(248,113,113,.25)', color: '#fca5a5' },
]

function stationUrl(uid) { return `https://www.sooplive.com/station/${uid}` }

export default function Home() {
  return (
    <main>
      <div className={styles.hero}>
        <img src="/banner.png" alt="가무소 크루" />
        <div className={styles.heroOverlay}>
          <div>
            <h1>🎙️ 가무소</h1>
            <p>가습기 사무소 · 숲 크루 · 멤버 15인</p>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.liveHeader}>
          <div className={styles.liveHeaderLeft}>
            <div className={styles.liveEyebrow}>
              <span className={styles.eyebrowDot} />
              MEMBERS
            </div>
            <h2 className={styles.liveCount}>
              가무소 <span className={styles.liveNum}>15인</span>
            </h2>
            <div className={styles.liveSubtitle}>
              클릭하면 숲 채널로 바로 이동해요
            </div>
          </div>
        </div>

        <div className={styles.offlineRow}>
          {CREW.map(m => {
            const av = AV_COLORS[m.c]
            return (
              <a key={m.uid} href={stationUrl(m.uid)} target="_blank" rel="noopener" className={styles.offChip}>
                <div className={styles.offAvatar} style={{ background: av.bg, color: av.color }}>
                  {m.name[0]}
                </div>
                <span className={styles.offName}>{m.name}</span>
                {m.role && <span className={styles.roleTag}>{m.role}</span>}
              </a>
            )
          })}
        </div>
      </div>

      <footer className={styles.footer}>
        가무소 팬페이지 · 팬메이드 비공식 페이지
      </footer>
    </main>
  )
}
