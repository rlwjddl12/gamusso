export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  if (!uid) return Response.json({ live: false });
  try {
    const res = await fetch(
      `https://black-art-16c8.7412369a.workers.dev/?bjid=${uid}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ live: false });
  }
}
