import inserNewUUIDwithEmailAlias from './SQL/insertNewUUIDwithEmailAlias.js';
import createProfileTableForNewUserDatabase from './SQL/createProfileTableForNewUserDatabase.js';
import deriveUserIdAlias from './utilities/deriveAlias.js';
async function getDbNameFromUserId(env, user_email) {
	const alias = await deriveUserIdAlias('email', user_email, await env.AUTHN_ALIAS_SALT.get());
	let user_id, res;
	user_id = crypto.randomUUID();
	res = await env.AUTHN_D1.prepare(inserNewUUIDwithEmailAlias).bind(user_id, alias, 'email').run();
	if (res.meta.changes === 0) return null;

	await env.AUTHN_KV.put(user_id, true);
	return user_id;
}

export async function handleCreateDbCall(url, env, form, cookies) {
	const [apiKey, user_id] = await Promise.all([env.D1_API_KEY.get(), getDbNameFromUserId(env, form.email)]);

	if (!user_id) return 409;
	const createDbRequest = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: user_id,
			region: 'EASTERN_EUROPE',
		}),
	});

	const createDbResponse = await createDbRequest.json();
	if (!createDbResponse.success) {
		throw new Error('D1 database creation failed: ' + JSON.stringify(createDbResponse));
	}

	const createProfileTableRequest = await fetch(`${url}/${encodeURIComponent(user_id)}/query`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			createProfileTableForNewUserDatabase,
			parameters: [
				user_id,
				form.firstname,
				form.lastname,
				form.email,
				['authn', 'theme'],
				{
					theme: 'dark',
					contrast: 'normal',
				},
				user_id,
				user_id,
			],
		}),
	});

	const createProfileTableResponse = await createProfileTableRequest.json();
	if (!createProfileTableResponse.success) {
		throw new Error('D1 database creation failed: ' + JSON.stringify(createDbResponse));
	}

	return 201;
}
