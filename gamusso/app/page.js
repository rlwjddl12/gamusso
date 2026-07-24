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
function profileImg(uid){return `https://stimg.sooplive.com/LOGO/${uid.substring(0,2)}/${uid}/${uid}.jpg`}
function stationUrl(uid){return `https://www.sooplive.com/station/${uid}`}
function liveUrl(uid){return `https://play.sooplive.com/${uid}`}

function MemberCard({ m, isLive }) {
  return (
    <a href={stationUrl(m.uid)} target="_blank" rel="noopener" className={styles.idCard} style={{'--card-color':m.c}}>
      <div className={styles.cardHole} />
      <div className={styles.cardLanyard} />
      <div className={styles.cardImgWrap}>
        <img src={profileImg(m.uid)} alt={m.name} className={styles.cardImg} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} />
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

function LiveCard({ m, thumb, title }) {
  return (
    <a
      href={liveUrl(m.uid)}
      target="_blank"
      rel="noopener"
      className={styles.liveCard}
    >
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

function PiggyBankRow({ entry }) {
  const member = CREW.find(m => m.uid === entry.uid)
  return (
    <div className={styles.piggyRow}>
      <span className={styles.piggyRowName} style={{ color: member?.c || '#4a90d9' }}>
        {member?.name || entry.uid}
      </span>
      <span className={styles.piggyRowDash}>-</span>
      <span className={styles.piggyRowAmount}>
        삼국지 {entry.amount?.toLocaleString()}개
      </span>
    </div>
  )
}

export default function Home(){
  const [liveData, setLiveData] = useState({})
  const [news, setNews] = useState([])
  const [piggyBanks, setPiggyBanks] = useState([])

  useEffect(() => {
    const check = async () => {
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
      setLiveData(Object.fromEntries(results))
    }
    check()
    const t = setInterval(check, 3 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    fetch('/news.json')
      .then(r => r.json())
      .then(setNews)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const loadPiggy = () => {
      fetch(`/api/piggybank?t=${Date.now()}`)
        .then(r => r.json())
        .then(setPiggyBanks)
        .catch(() => {})
    }
    loadPiggy()
    const t = setInterval(loadPiggy, 60 * 1000)
    return () => clearInterval(t)
  }, [])

  const liveMembers = CREW.filter(m => liveData[m.uid]?.live)
  const offMembers = CREW.filter(m => !liveData[m.uid]?.live)

  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1.2rem',fontWeight:600,background:'#333'}}>
          이미지 수정중
        </div>
      </div>

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

      {piggyBanks.length > 0 && (
        <div className={styles.container}>
          <div className={styles.secLabel}>🐷 삼국지 저금통</div>
          <div className={styles.piggyList}>
            {piggyBanks.map((entry, i) => (
              <PiggyBankRow key={entry.uid + i} entry={entry} />
            ))}
          </div>
        </div>
      )}

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

      <div className={styles.container}>
        <div className={styles.secLabel}>● 오프라인 멤버</div>
        <div className={styles.cardGrid}>
          {offMembers.map(m => <MemberCard key={m.uid} m={m} isLive={false} />)}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.secLabel}>⚔ GAME</div>
        <a href="/game.html" className={styles.gameBtn}>
          ⚔ 삼국지 운영 연습 게임 · 천하쟁탈전
        </a>
      </div>

      <footer className={styles.footer}>원더독 팬페이지 · 팬메이드 비공식 페이지</footer>
    </main>
  )
}
