        // app/api/piggybank/route.js
import { NextResponse } from 'next/server'

const CREW_UIDS = [
  'hwt1014', 'jamyul2', 'ekrekrnfl9', 'gkxl1004', 'dinggoolx3',
  'toocats', 'tndk321', 'ddr9463', '200501', 'yeonchimin',
  'odoeun', 'wjdekgus112', 'fbcogk', '33h2101', '59590423',
]

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
      .filter(m => m.status === 'PROGRESS' && (m.title || '').includes('삼국지'))
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
  const entries = results.flat().sort((a, b) => b.amount - a.amount)
  return NextResponse.json(entries, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
