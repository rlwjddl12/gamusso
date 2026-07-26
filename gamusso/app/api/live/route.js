export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const uidsParam = searchParams.get('uids')
  const singleUid = searchParams.get('uid')

  const uids = uidsParam
    ? uidsParam.split(',').map(s => s.trim()).filter(Boolean)
    : (singleUid ? [singleUid] : [])

  if (uids.length === 0) return Response.json({ live: false })

  const fetchOne = async (uid) => {
    try {
      const res = await fetch(
        `https://black-art-16c8.7412369a.workers.dev/?bjid=${uid}`,
        { signal: AbortSignal.timeout(8000) }
      )
      const data = await res.json()
      return [uid, data]
    } catch (e) {
      return [uid, { live: false }]
    }
  }

  const results = await Promise.all(uids.map(fetchOne))
  const map = Object.fromEntries(results)

  // 예전처럼 uid=하나만 넘긴 경우엔 그 결과만 바로 반환 (하위 호환)
  if (singleUid && !uidsParam) {
    return Response.json(map[singleUid] || { live: false })
  }

  return Response.json(map)
}
