export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  if (!uid) return Response.json({ live: false });

  try {
    const res = await fetch(
     `https://gamusso-proxy-672047278242.asia-northeast3.run.app/?bjid=${uid}`
      { signal: AbortSignal.timeout(8000) }
    );

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = {}; }

    const isLive = data?.RESULT === 1 || data?.RESULT === '1';
    const broad = data?.REAL_BROAD?.[0] || null;

    return Response.json({
      live: isLive,
      broadNo: broad?.broad_no || null,
      title: broad?.broad_title || '',
      viewers: parseInt(broad?.total_view_cnt || '0'),
      thumb: broad?.broad_no ? `https://liveimg.sooplive.co.kr/m/${broad.broad_no}` : null,
    });
  } catch (e) {
    return Response.json({ live: false });
  }
}
