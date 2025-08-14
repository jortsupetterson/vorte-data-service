import widgetMap from './components/widgetMap.js';

export async function handleGetDashboardContentCall(env, ctx, apiKey, lang, url) {
	//const cacheKey = new Request(`${url}?dashboard`);

	//const cached = await caches.default.match(cacheKey);
	//if (cached) return cached;

	const getProfileRequest = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sql: `SELECT firstname, lastname, widgets_list FROM profile`,
		}),
	});

	const getProfileResponse = await getProfileRequest.json();

	if (!getProfileResponse.success) {
		const err = new Response('D1 profile table read failed (SELECT widgets_list): ' + JSON.stringify(getProfileResponse), {
			status: 200,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
		return err;
	}
	const data = getProfileResponse.result[0].results[0];
	let html = ``;
	const firstname = data.firstname;
	const lastname = data.lastname;
	const widgetArr = await JSON.parse(data.widgets_list);

	await widgetArr.forEach(async (widgetName) => {
		const handler = widgetMap[widgetName];
		const content = await handler(lang, firstname, lastname);
		html = html + content;
	});

	const resp = {
		status: 200,
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
		body: html,
	};

	return resp;
}
