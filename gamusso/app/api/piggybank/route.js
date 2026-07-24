// app/api/piggybank/route.js
import { NextResponse } from 'next/server'

const CREW_UIDS = [
  'hwt1014', 'jamyul2', 'ekrekrnfl9', 'gkxl1004', 'dinggoolx3',
  'toocats', 'tndk321', 'ddr9463', '200501', 'yeonchimin',
  'odoeun', 'wjdekgus112', 'fbcogk', '33h2101', '59590423',
]

async function fetchChallengeFunding(uid) {
  const body = new URLSearchParams()
  body.append('szWork', 'getChallengeFunding')
  body.append('szBjId', uid)
  body.append('szStatus[]', 'PROGRESS')

  try {
    const res = await fetch('https://live.sooplive.com/api/mission_funding_api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://play.sooplive.com',
        'Referer': `https://play.sooplive.com/${uid}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      },
      body,
      cache: 'no-store',
    })
    const json = await res.json()
    if (json.result !== 1 || !Array.isArray(json.data)) return []

    return json.data
      .filter(m => m.status === 'PROGRESS' && (m.title || '').includes('삼국지'))
      .map(m => ({
        uid: m.bj_id,
        title: m.title,
        amount: Number(m.balloon_cnt) || 0,
      }))
  } catch {
    return []
  }
}

export async function GET() {
  const results = await Promise.all(CREW_UIDS.map(fetchChallengeFunding))
  const entries = results.flat()
  return NextResponse.json(entries, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
