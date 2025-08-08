export async function getDatabaseUuidFromName(name, ctx, apiKey) {
	const key = `https://data.vorte.app/${encodeURIComponent(name)}/db/uuid`;
	const cache = caches.default;
	let r = await cache.match(key);
	let uuid = r && r.ok ? (await r.text()).trim() : '';
	if (!uuid) {
		const u = new URL(`https://api.cloudflare.com/client/v4/accounts/e8ef5da3c57b544081f2e4181d6cecc9/d1/database`);
		u.searchParams.set('name', name);
		u.searchParams.set('per_page', '10');
		const res = await fetch(u.toString(), { headers: { Authorization: `Bearer ${apiKey}` }, cf: { cacheTtl: 0 } });
		const data = await res.json();
		const list = Array.isArray(data?.result) ? data.result : data?.result?.items || [];
		const hit = list.find((d) => d?.name === name);
		if (!hit?.uuid) throw new Error(`D1 database not found for name='${name}'`);
		uuid = hit.uuid;
		const resp = new Response(uuid, {
			headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'max-age=86400, stale-while-revalidate=3600' },
		});
		ctx.waitUntil(cache.put(key, resp));
	}
	return `https://api.cloudflare.com/client/v4/accounts/e8ef5da3c57b544081f2e4181d6cecc9/d1/database/${uuid}/query`;
}
