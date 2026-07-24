// app/api/piggybank/route.js
import { NextResponse } from 'next/server'

const CREW_UIDS = [
  'hwt1014', 'jamyul2', 'ekrekrnfl9', 'gkxl1004', 'dinggoolx3',
  'toocats', 'tndk321', 'ddr9463', '200501', 'yeonchimin',
  'odoeun', 'wjdekgus112', 'fbcogk', '33h2101', '59590423',
]

// 제목에 "삼국지"가 없어도 예외적으로 보여줄 uid 목록 (예: 딩굴)
const TITLE_FILTER_EXEMPT_UIDS = ['dinggoolx3']

async function fetchChallengeFunding(uid, debug) {
  const body = new URLSearchParams()
  body.append('szWork', 'getChallengeFunding')
  body.append('szBjId', uid)
  body.append('szStatus', JSON.stringify(['REQUEST', 'PROGRESS', 'SUCCESS', 'FAIL', 'CANCEL']))

  try {
    const res = await fetch('https://live.sooplive.com/api/challenge_funding_api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://play.sooplive.com',
        'Referer': `https://play.sooplive.com/${uid}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
        'Cookie': process.env.SOOP_SESSION_COOKIE || '',
      },
      body,
      cache: 'no-store',
    })
    const rawText = await res.text()
    let json
    try { json = JSON.parse(rawText) } catch { json = null }

    if (debug) {
      return { uid, httpStatus: res.status, rawText, parsed: json }
    }

    if (!json || json.result !== 1 || !Array.isArray(json.data)) return []

    return json.data
      .filter(m => {
        if (m.status !== 'PROGRESS') return false
        if (TITLE_FILTER_EXEMPT_UIDS.includes(m.bj_id)) return true
        return (m.title || '').includes('삼국지')
      })
      .map(m => ({
        uid: m.bj_id,
        title: m.title,
        amount: Number(m.balloon_cnt) || 0,
      }))
  } catch (err) {
    if (debug) return { uid, error: String(err) }
    return []
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const debug = searchParams.has('debug')

  if (debug) {
    const uid = searchParams.get('uid') || 'hwt1014'
    const result = await fetchChallengeFunding(uid, true)
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  }

  const results = await Promise.all(CREW_UIDS.map(uid => fetchChallengeFunding(uid, false)))
  const flat = results.flat()

  // 같은 사람이 미션을 여러 개 진행중이면 금액을 합쳐서 한 줄로 표시
  const merged = {}
  for (const e of flat) {
    if (!merged[e.uid]) {
      merged[e.uid] = { uid: e.uid, title: e.title, amount: 0 }
    }
    merged[e.uid].amount += e.amount
  }
  const entries = Object.values(merged).sort((a, b) => b.amount - a.amount)

  return NextResponse.json(entries, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
