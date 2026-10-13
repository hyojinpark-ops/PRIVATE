// Netlify Function: the Gemini API key is only accessed on the server.
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const reply = (statusCode, obj) => ({ statusCode, headers, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'POST 요청만 허용됩니다.' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return reply(500, { error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.' });
  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return reply(400, { error: '요청 데이터 형식이 올바르지 않습니다.' }); }
  if (!Array.isArray(payload.contents) || payload.contents.length === 0) {
    return reply(400, { error: '분석할 내용이 없습니다.' });
  }
  // Limit payload size to reduce accidental large spreadsheet submissions.
  if ((event.body || '').length > 100000) return reply(413, { error: '요청 내용이 너무 큽니다.' });

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const data = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      const msg = data?.error?.message || `Gemini API 오류 (HTTP ${upstream.status})`;
      console.error('Gemini API request failed:', upstream.status, msg);
      return reply(upstream.status, { error: `Gemini API 오류 (${upstream.status}): ${msg}` });
    }
    return reply(200, data);
  } catch (error) {
    console.error('Gemini function request failed:', error?.name || 'unknown');
    return reply(error?.name === 'AbortError' ? 504 : 502, {
      error: error?.name === 'AbortError' ? 'AI 응답 시간이 초과되었습니다. 다시 시도해주세요.' : 'AI 서버 연결에 실패했습니다.'
    });
  } finally {
    clearTimeout(timeout);
  }
};
