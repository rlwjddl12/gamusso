export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  if (!uid) return Response.json({ live: false });
  try {
    const res = await fetch(
      `https://gamusso-proxy-672047278242.asia-northeast3.run.app/?bjid=${uid}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ live: false });
  }
}
