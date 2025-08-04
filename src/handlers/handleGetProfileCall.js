import { getDatabaseUuidFromName } from './utilities/getDatabaseUuidFromName.js';

export async function handleGetProfileCall(user_id, env, ctx) {
	const [url, apiKey] = await Promise.all([getDatabaseUuidFromName(user_id, env, ctx), env.D1_API_KEY.get()]);

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

	if (!getProfileResponse.success) {
		throw new Error('D1 profile table read failed (SELECT ALL): ' + JSON.stringify(getProfileResponse));
	}
}
