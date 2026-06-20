export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  if (!uid) return Response.json({ error: 'no uid' }, { status: 400 });

  try {
    const res = await fetch(
      'https://live.sooplive.co.kr/afreeca/player_live_api.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://play.sooplive.com/',
          'Origin': 'https://play.sooplive.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Cookie': 'PdboxBbs=; RDB=; PHPSESSID=',
        },
        body: `bjid=${uid}&type=live&confirm_adult=0&player_type=html5&mode=landing`,
        next: { revalidate: 60 },
      }
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
    return Response.json({ live: false, error: e.message });
  }
}
