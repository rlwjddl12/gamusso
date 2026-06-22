'use client'
import { useState, useEffect } from 'react'
import styles from './page.module.css'
const CREW = [
  {name:'가습기',role:'소장님',uid:'hwt1014',c:'#4a90d9'},
  {name:'새잎',role:'반장',uid:'likey0u',c:'#5bc4a0'},
  {name:'잼율이',role:null,uid:'jamyul2',c:'#e89fc0'},
  {name:'기찬하',role:null,uid:'khj011219',c:'#a78bfa'}, 
  {name:'야뿌',role:null,uid:'ekrekrnfl9',c:'#7ec8e3'},
  {name:'하티하티',role:null,uid:'gkxl1004',c:'#f4a460'},
  {name:'딩굴',role:null,uid:'dinggoolx3',c:'#90ee90'},
  {name:'투냥츠',role:null,uid:'toocats',c:'#ffb6c1'},
  {name:'단수아',role:null,uid:'tndk321',c:'#dda0dd'},
  {name:'류채아',role:null,uid:'gio12025',c:'#f08080'},
  {name:'희꾸미',role:null,uid:'ddr9463',c:'#20b2aa'},
  {name:'연보라',role:null,uid:'200501',c:'#9370db'},
  {name:'연치민',role:null,uid:'yeonchimin',c:'#6495ed'},
  {name:'쨈도은',role:null,uid:'odoeun',c:'#ffd700'},
  {name:'정다니',role:null,uid:'wjdekgus112',c:'#cd853f'},
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
        <div className={styles.cardSub}>가무소</div>
        {m.role && <div className={styles.cardRole}>{m.role}</div>}
      </div>
    </a>
  )
}

export default function Home(){
  const [liveData, setLiveData] = useState({})
  const [news, setNews] = useState([])

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

  const liveMembers = CREW.filter(m => liveData[m.uid]?.live)
  const offMembers = CREW.filter(m => !liveData[m.uid]?.live)

  return (
    <main>
      <div className={styles.hero}>
        <img src="https://raw.githubusercontent.com/rlwjddl12/gamusso/main/gamusso/app/Banner.png" alt="가무소 크루" className={styles.heroBg} />
        <div className={styles.heroOverlay} />
      </div>

      {liveMembers.length > 0 && (
        <div className={styles.container}>
          <div className={styles.secLabel}>🔴 LIVE NOW · {liveMembers.length}명 방송중</div>
          <div className={styles.liveGrid}>
            {liveMembers.map(m => (
              <a key={m.uid} href={liveUrl(m.uid)} target="_blank" rel="noopener" className={styles.liveCard}>
                <div className={styles.liveThumbWrap}>
                  {liveData[m.uid]?.thumb
                    ? <img src={liveData[m.uid].thumb} alt={m.name} className={styles.liveThumb} />
                    : <div className={styles.liveThumbFallback}>📡</div>
                  }
                  <div className={styles.liveBadge}>● LIVE</div>
                </div>
                <div className={styles.liveInfo}>
                  <div>
                    <div className={styles.liveName}>{m.name}</div>
                    <div className={styles.liveTitle}>{liveData[m.uid]?.title || ''}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {news.length > 0 && (
        <div className={styles.container}>
          <div className={styles.newsHeader}>
            <div className={styles.secLabel} style={{marginBottom: 0}}>📰 가무소식</div>
            <div className={styles.updateLog}>🔧 v0.6.23 · 방송국 링크 수정, 뉴스 섹션 추가</div>
          </div>
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

      <footer className={styles.footer}>가무소 팬페이지 · 팬메이드 비공식 페이지</footer>
    </main>
  )
}
