'use client'
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
export default function Home(){
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
        <div className={styles.secLabel}>● MEMBERS</div>
        <div className={styles.cardGrid}>
          {CREW.map(m => (
            <a key={m.uid} href={stationUrl(m.uid)} target="_blank" rel="noopener" className={styles.idCard} style={{'--card-color':m.c}}>
              <div className={styles.cardHole} />
              <div className={styles.cardLanyard} />
              <div className={styles.cardImgWrap}>
                <img src={profileImg(m.uid)} alt={m.name} className={styles.cardImg} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}} />
                <div className={styles.cardImgFallback}>{m.name[0]}</div>
              </div>
              <div className={styles.cardBottom}>
                <div className={styles.cardName}>{m.name}</div>
                <div className={styles.cardSub}>가무소</div>
                {m.role && <div className={styles.cardRole}>{m.role}</div>}
              </div>
            </a>
          ))}
        </div>
      </div>
      <footer className={styles.footer}>가무소 팬페이지 · 팬메이드 비공식 페이지</footer>
    </main>
  )
}
