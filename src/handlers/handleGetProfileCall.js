import { getDatabaseUuidFromName } from './utilities/getDatabaseUuidFromName.js';

export async function handleGetProfileCall(user_id, env, ctx) {
	const apiKey = await env.D1_API_KEY.get();
	const url = await getDatabaseUuidFromName(user_id, ctx, apiKey);

	const getProfileRequest = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sql: `
             SELECT * FROM profile
            `,
		}),
	});

	const getProfileResponse = await getProfileRequest.json();
	const content = JSON.stringify(getProfileResponse);
	if (!getProfileResponse.success) {
		throw new Error('D1 profile table read failed (SELECT ALL): ' + content);
	}

	ctx.waitUntil(env.PROFILES_KV.put(user_id, content, { expirationTtl: 2_592_000 }));

	return content;
}
